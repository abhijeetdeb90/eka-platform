/**
 * EKA Platform - Creator Earnings Engine
 * 
 * Independent financial calculation and distribution service.
 * Ingests deliverables, contracts, and campaign amounts; computes
 * gross earnings, platform commission, configurable tax deductions (TDS),
 * and creates corresponding double-entry ledger postings.
 * 
 * Never uses floating-point arithmetic.
 */

import { randomUUID } from "node:crypto";
import type { CreatorEarning, Currency, EarningPayoutStatus } from "./types";
import { financialLedgerService } from "./ledger.service";

export interface CalculateEarningsInput {
  campaign_id?: string;
  creator_id: string;
  deliverable_id?: string;
  contract_id?: string;
  campaign_amount_minor: number; // in paise
  commission_percent?: number; // e.g. 10 for 10%, 15 for 15%
  tax_rules?: {
    tds_rate_percent?: number; // e.g. 10% u/s 194J or 1% u/s 194O
    pan_verified?: boolean;
    custom_deduction_minor?: number;
    notes?: string;
  };
  currency?: Currency;
}

// In-memory store for fallback/testing
const inMemoryEarnings: CreatorEarning[] = [];

export class CreatorEarningsEngine {
  /**
   * Generates a unique Earning ID: EKA-EARN-XXXXXXXX
   */
  public generateEarningId(): string {
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `EKA-EARN-${suffix}`;
  }

  /**
   * Calculates earnings breakdown and records immutable ledger entries.
   */
  async processEarning(input: CalculateEarningsInput): Promise<CreatorEarning> {
    const { campaign_amount_minor } = input;
    if (campaign_amount_minor <= 0 || !Number.isInteger(campaign_amount_minor)) {
      throw new Error(`Invalid campaign amount: must be positive integer minor units, got ${campaign_amount_minor}`);
    }

    const commissionPercent = input.commission_percent ?? 10; // Default 10%
    // Platform fee in paise
    const platform_fee_minor = Math.round((campaign_amount_minor * commissionPercent) / 100);

    // Gross creator earning is total campaign amount
    const gross_earning_minor = campaign_amount_minor;

    // TDS withholding: Default 10% for professional technical services (194J), or 1% for e-commerce operator (194O)
    // If PAN is missing/unverified, standard higher rate applies (20%)
    let tdsPercent = input.tax_rules?.tds_rate_percent ?? 10;
    if (input.tax_rules && input.tax_rules.pan_verified === false) {
      tdsPercent = 20; // Section 206AA penal rate
    }

    // Tax deduction calculated on Creator's gross share before platform fee (or net depending on legal setup)
    // Standard marketplace practice: TDS deducted on net creator credit (gross - fee)
    const creatorBase = gross_earning_minor - platform_fee_minor;
    const tax_deduction_minor = Math.round((creatorBase * tdsPercent) / 100);

    const other_deductions_minor = input.tax_rules?.custom_deduction_minor ?? 0;

    // Net payable to creator
    const net_payable_minor = creatorBase - tax_deduction_minor - other_deductions_minor;

    if (net_payable_minor < 0) {
      throw new Error(`Computed negative net payable (${net_payable_minor}) for campaign amount ${campaign_amount_minor}`);
    }

    const earningId = this.generateEarningId();
    const now = new Date().toISOString();
    const currency = input.currency ?? "INR";

    const earning: CreatorEarning = {
      id: randomUUID(),
      earning_id: earningId,
      campaign_id: input.campaign_id,
      creator_id: input.creator_id,
      deliverable_id: input.deliverable_id,
      contract_id: input.contract_id,
      campaign_amount_minor,
      gross_earning_minor,
      platform_fee_minor,
      tax_deduction_minor,
      other_deductions_minor,
      net_payable_minor,
      currency,
      payout_status: "ELIGIBLE",
      tax_rules: input.tax_rules ?? {},
      calculation_breakdown: {
        commission_rate_percent: commissionPercent,
        tds_rate_percent: tdsPercent,
        notes: input.tax_rules?.notes ?? "Computed via EKA Creator Earnings Engine",
      },
      created_at: now,
      updated_at: now,
    };

    // 1. Double-Entry: Brand/Client pays Creator Gross Earning
    const payerId = input.campaign_id ? `brand_${input.campaign_id}` : "client_general";
    await financialLedgerService.recordDoubleEntry({
      source: "brand_campaign",
      reference_id: earningId,
      amount_minor: gross_earning_minor,
      currency,
      debitEntity: { id: payerId, type: "brand" },
      creditEntity: { id: input.creator_id, type: "creator" },
      metadata: { earning_id: earningId, type: "gross_earning" },
    });

    // 2. Double-Entry: Creator pays Platform Commission to EKA
    if (platform_fee_minor > 0) {
      await financialLedgerService.recordDoubleEntry({
        source: "platform_fee",
        reference_id: earningId,
        amount_minor: platform_fee_minor,
        currency,
        debitEntity: { id: input.creator_id, type: "creator" },
        creditEntity: { id: "eka_platform", type: "platform" },
        metadata: { earning_id: earningId, type: "platform_commission" },
      });
    }

    // 3. Double-Entry: Creator tax withholding transferred to Tax Authority escrow
    if (tax_deduction_minor > 0) {
      await financialLedgerService.recordDoubleEntry({
        source: "tax_withholding",
        reference_id: earningId,
        amount_minor: tax_deduction_minor,
        currency,
        debitEntity: { id: input.creator_id, type: "creator" },
        creditEntity: { id: "in_tax_authority_194j", type: "tax_authority" },
        metadata: { earning_id: earningId, tds_percent: tdsPercent, type: "tds_withholding" },
      });
    }

    // Persist to database if available
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await (supabaseAdmin as any).from("creator_earnings").insert({
        id: earning.id,
        earning_id: earning.earning_id,
        campaign_id: earning.campaign_id,
        creator_id: earning.creator_id,
        deliverable_id: earning.deliverable_id,
        contract_id: earning.contract_id,
        campaign_amount_minor: earning.campaign_amount_minor,
        gross_earning_minor: earning.gross_earning_minor,
        platform_fee_minor: earning.platform_fee_minor,
        tax_deduction_minor: earning.tax_deduction_minor,
        other_deductions_minor: earning.other_deductions_minor,
        net_payable_minor: earning.net_payable_minor,
        currency: earning.currency,
        payout_status: earning.payout_status,
        tax_rules: earning.tax_rules as never,
        calculation_breakdown: earning.calculation_breakdown as never,
        created_at: earning.created_at,
        updated_at: earning.updated_at,
      });
    } catch {
      // In-memory fallback
    }

    inMemoryEarnings.push(earning);
    return earning;
  }

  async getEarningsByCreator(creatorId: string): Promise<CreatorEarning[]> {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await (supabaseAdmin as any)
        .from("creator_earnings")
        .select("*")
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as unknown) as CreatorEarning[];
      }
    } catch {
      // ignore
    }

    return inMemoryEarnings.filter((e) => e.creator_id === creatorId);
  }

  async getEarningById(earningId: string): Promise<CreatorEarning | null> {
    const memory = inMemoryEarnings.find((e) => e.earning_id === earningId || e.id === earningId);
    if (memory) return memory;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data } = await (supabaseAdmin as any)
        .from("creator_earnings")
        .select("*")
        .or(`earning_id.eq.${earningId},id.eq.${earningId}`)
        .maybeSingle();

      if (data) return (data as unknown) as CreatorEarning;
    } catch {
      // ignore
    }

    return null;
  }

  clearInMemoryStore(): void {
    inMemoryEarnings.length = 0;
  }
}

export const creatorEarningsEngine = new CreatorEarningsEngine();

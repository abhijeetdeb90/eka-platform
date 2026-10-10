import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppScreen } from "@/components/app/AppScreen";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Upload, Award, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/app/creator/verification")({
  component: VerificationPage,
});

function VerificationPage() {
  const { data: profile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile?.id) return;
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const { error } = await supabase.from('custodian_lineages').insert({
        user_id: profile.id,
        lineage_name: formData.get('lineage_name'),
        expertise_domain: formData.get('expertise_domain'),
        generation_number: parseInt(formData.get('generation_number') as string) || 1,
        verification_status: 'pending',
      });

      if (error) throw error;
      
      setSubmitted(true);
      toast.success("Verification request submitted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen eyebrow="Trust & Provenance" title="Custodian Verification">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Award className="size-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl">Apply for Cultural Custodian Status</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
            EKA's moat is cultural accuracy. We manually verify master artisans, indigenous elders, and generational knowledge holders to grant them visual priority and elevated trust tiers in the ecosystem.
          </p>
        </div>

        {submitted ? (
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <CheckCircle2 className="size-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-medium text-emerald-900">Application Received</h3>
              <p className="text-sm text-emerald-700/80">
                Our cultural intelligence team will review your credentials and community standing. This process typically takes 3-5 business days.
              </p>
              <Button variant="outline" asChild className="mt-4">
                <Link to="/app/creator/dashboard">Return to Studio</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Lineage & Expertise Details</CardTitle>
                <CardDescription>Provide details about your traditional knowledge base.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lineage / Community Name</label>
                  <Input name="lineage_name" placeholder="e.g. Kanchipuram Weavers, Vedic Chanting Lineage" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Domain of Expertise</label>
                  <Input name="expertise_domain" placeholder="e.g. Handloom Textiles, Ayurveda, Classical Music" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Generation (if applicable)</label>
                  <Input name="generation_number" type="number" min="1" placeholder="e.g. 5" />
                  <p className="text-[10px] text-muted-foreground">Are you a 3rd or 4th generation practitioner? Leave blank if not applicable.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Supporting Evidence / Portfolio</label>
                  <Textarea name="evidence" placeholder="Links to publications, community recognition, or portfolio." className="min-h-[100px]" />
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex gap-3">
                  <ShieldCheck className="size-5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By submitting this form, you attest that the information provided is culturally accurate and you hold the appropriate permissions from your community to share this knowledge.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-6">
                <Button variant="ghost" asChild>
                  <Link to="/app/creator/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </div>
    </AppScreen>
  );
}

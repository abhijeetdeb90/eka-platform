/**
 * EKA Europeana Cultural Heritage Connector
 *
 * Provides structured access to digitized cultural heritage objects from
 * European libraries, museums, and national archives.
 *
 * Rights Framework:
 * Strictly parses Europeana Rights Statements (`edm:rights`) and rejects
 * assets marked "In Copyright - No Re-use".
 */

export interface EuropeanaHeritageObject {
  id: string; // e.g. "eur_9200300_BibliographicItem_102"
  title: string;
  creator?: string;
  contributingInstitution: string;
  country: string;
  year?: string;
  type: "IMAGE" | "TEXT" | "SOUND" | "VIDEO" | "3D";
  digitalObjectUrl: string;
  thumbnailUrl: string;
  rightsStatement: string; // e.g. "http://creativecommons.org/publicdomain/mark/1.0/"
  reUseAllowed: boolean;
  institutionalAttribution: string;
}

export const EUROPEANA_CANONICAL_OBJECTS: Record<string, EuropeanaHeritageObject> = {
  eur_vedic_manuscript: {
    id: "eur_vedic_manuscript",
    title: "Rigveda Manuscript on Birch Bark in Sharada Script",
    creator: "Kashmir Scribe Lineage",
    contributingInstitution: "Bhandarkar Oriental Research Institute / Europeana Consortium",
    country: "India / International Archive",
    year: "15th Century CE",
    type: "IMAGE",
    digitalObjectUrl: "/content/reading-table.jpg",
    thumbnailUrl: "/content/reading-table.jpg",
    rightsStatement: "http://creativecommons.org/publicdomain/mark/1.0/",
    reUseAllowed: true,
    institutionalAttribution:
      "Digitized manuscript provided via Europeana under Public Domain Mark 1.0. Original preserved at BORI.",
  },
  eur_marrakesh_astrolabe: {
    id: "eur_marrakesh_astrolabe",
    title: "Brass Planispheric Astrolabe with Arabic & Maghrebi Inscriptions",
    creator: "Muhammad ibn Ahmad al-Battuti",
    contributingInstitution: "Museum of the History of Science / Europeana",
    country: "Morocco",
    year: "1738 CE",
    type: "3D",
    digitalObjectUrl: "/places/marrakesh.jpg",
    thumbnailUrl: "/places/marrakesh.jpg",
    rightsStatement: "http://creativecommons.org/licenses/by/4.0/",
    reUseAllowed: true,
    institutionalAttribution:
      "Astrolabe artifact records via Europeana under Creative Commons Attribution 4.0 International.",
  },
};

/**
 * Validates Europeana rights statement and maps to EKA compliance standard.
 */
export function validateEuropeanaRights(rightsUri: string): {
  reUseAllowed: boolean;
  notes: string;
} {
  if (
    rightsUri.includes("publicdomain") ||
    rightsUri.includes("zero/1.0") ||
    rightsUri.includes("by/4.0") ||
    rightsUri.includes("by-sa/4.0")
  ) {
    return {
      reUseAllowed: true,
      notes: "Open public license; permissible for EKA knowledge graph indexing and display.",
    };
  }

  return {
    reUseAllowed: false,
    notes:
      "Restricted copyright statement. Asset cannot be publicly mirrored; bibliographic citation permitted only.",
  };
}

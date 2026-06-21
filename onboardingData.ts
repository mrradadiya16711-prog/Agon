import {
  Store, MicVocal, Users, UtensilsCrossed, Target, CalendarClock,
  Share2, Sparkles, MessageSquareHeart, CheckSquare, type LucideIcon,
} from "lucide-react";

export interface StepMeta {
  id: number;
  title: string;
  short: string;
  icon: LucideIcon;
}

export const STEPS: StepMeta[] = [
  { id: 1, title: "Business basics", short: "Business", icon: Store },
  { id: 2, title: "Brand voice & audience", short: "Voice", icon: MicVocal },
  { id: 3, title: "Menu & content", short: "Content", icon: UtensilsCrossed },
  { id: 4, title: "Posting & platforms", short: "Schedule", icon: CalendarClock },
  { id: 5, title: "Automation preferences", short: "Automation", icon: Sparkles },
  { id: 6, title: "Review & confirm", short: "Review", icon: CheckSquare },
];

export const RESTAURANT_TYPES = [
  { value: "fine-dining", label: "Fine dining" },
  { value: "casual", label: "Casual dining" },
  { value: "fast-casual", label: "Fast casual" },
  { value: "cafe", label: "Café / Coffee shop" },
  { value: "pizzeria", label: "Pizzeria" },
  { value: "bakery", label: "Bakery" },
  { value: "bar-pub", label: "Bar / Pub" },
  { value: "food-truck", label: "Food truck" },
  { value: "catering", label: "Catering" },
  { value: "other", label: "Other" },
];

export const LOCATION_COUNTS = [
  { value: "1", label: "1 location" },
  { value: "2-5", label: "2–5 locations" },
  { value: "6-10", label: "6–10 locations" },
  { value: "10+", label: "10+ locations" },
];

export const BRAND_VOICES = [
  { value: "warm-cozy", label: "Warm & cozy", desc: "Friendly, inviting, like talking to a regular" },
  { value: "bold-energetic", label: "Bold & energetic", desc: "Punchy, exciting, high-energy hype" },
  { value: "elegant-refined", label: "Elegant & refined", desc: "Sophisticated, understated, premium feel" },
  { value: "playful-fun", label: "Playful & fun", desc: "Witty, light-hearted, doesn't take itself too seriously" },
  { value: "professional-classic", label: "Professional & classic", desc: "Clean, straightforward, trustworthy" },
];

export const TARGET_AUDIENCES = [
  { value: "families", label: "Families" },
  { value: "young-professionals", label: "Young professionals" },
  { value: "couples", label: "Couples / date night" },
  { value: "tourists", label: "Tourists & visitors" },
  { value: "students", label: "Students" },
  { value: "foodies", label: "Foodies & critics" },
  { value: "corporate", label: "Corporate & events" },
  { value: "locals", label: "Neighborhood regulars" },
];

export const MENU_CATEGORIES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "brunch", label: "Brunch" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "desserts", label: "Desserts" },
  { value: "drinks", label: "Drinks & cocktails" },
  { value: "coffee", label: "Coffee & tea" },
  { value: "catering", label: "Catering" },
  { value: "specials", label: "Daily specials" },
  { value: "kids", label: "Kids menu" },
];

export const PROMOTION_GOALS = [
  { value: "new-dishes", label: "New dish launches" },
  { value: "daily-specials", label: "Daily & weekly specials" },
  { value: "events", label: "Events & live nights" },
  { value: "holidays", label: "Holiday promotions" },
  { value: "loyalty", label: "Loyalty & repeat visits" },
  { value: "awareness", label: "Brand awareness" },
  { value: "reservations", label: "Drive reservations" },
  { value: "reviews", label: "Get more reviews" },
];

export const POSTING_FREQUENCIES = [
  { value: "1-week", label: "1× per week", desc: "Light presence" },
  { value: "2-3-week", label: "2–3× per week", desc: "Steady & consistent" },
  { value: "daily", label: "Once a day", desc: "Active & visible" },
  { value: "2-day", label: "2× per day", desc: "Maximum reach" },
];

export const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
];

export const SEASONS = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
  { value: "winter", label: "Winter" },
  { value: "holidays", label: "Holiday season" },
  { value: "valentines", label: "Valentine's Day" },
  { value: "mothers-day", label: "Mother's Day" },
  { value: "summer-menu", label: "Summer menu launch" },
];

export const REVIEW_STYLES = [
  { value: "warm-personal", label: "Warm & personal", desc: "Thank them by name, mention specifics, invite them back" },
  { value: "professional-brief", label: "Professional & brief", desc: "Polite, short, address concerns if any" },
  { value: "playful", label: "Playful & witty", desc: "Match the brand's fun tone, use humor" },
  { value: "no-respond", label: "I'll handle reviews myself", desc: "Mesa won't respond to reviews" },
];

export const APPROVAL_WORKFLOWS = [
  { value: "approve-all", label: "Approve every post", desc: "You review each post before it goes live. Full control." },
  { value: "approve-then-auto", label: "Approve first week, then autopilot", desc: "Review for the first week. Once you trust the voice, Mesa posts automatically." },
  { value: "full-autopilot", label: "Full autopilot from day one", desc: "Mesa posts on schedule. You get a weekly digest, not a daily to-do." },
];

export interface OnboardingData {
  // Step 1
  businessName: string;
  restaurantType: string;
  locationCount: string;
  // Step 2
  brandVoice: string;
  targetAudiences: string[];
  // Step 3
  menuCategories: string[];
  promotionGoals: string[];
  // Step 4
  postingFrequency: string;
  platforms: string[];
  // Step 5
  seasonalCampaigns: string[];
  reviewStyle: string;
  approvalWorkflow: string;
}

export const EMPTY_DATA: OnboardingData = {
  businessName: "",
  restaurantType: "",
  locationCount: "",
  brandVoice: "",
  targetAudiences: [],
  menuCategories: [],
  promotionGoals: [],
  postingFrequency: "",
  platforms: [],
  seasonalCampaigns: [],
  reviewStyle: "",
  approvalWorkflow: "",
};

export function getLabel(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label || value;
}

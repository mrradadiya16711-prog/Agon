export interface MetricCard {
  key: string;
  label: string;
  value: string;
  delta: string;
  up: boolean;
}

export const DEMO_INSIGHTS = [
  { metric: "Reels vs carousels", insight: "Reels drive 3.1× more saves", action: "Prioritize Reels for new dishes" },
  { metric: "Best post time", insight: "6:15 PM beats 5:00 PM by 42%", action: "Shift dinner posts to 6:15 PM" },
  { metric: "Hook style", insight: "Price-mention hooks double saves", action: "Lead with price on specials" },
  { metric: "Caption length", insight: "90–120 chars gets most shares", action: "Trim captions under 120 chars" },
];

export const TOP_POSTS = [
  { caption: "New on the menu: brown-butter gnocchi, crisped sage, parmesan broil. Tonight only.", platform: "instagram", views: "4.2k", saves: 312, clicks: 48, img: "/images/dish-1.jpg" },
  { caption: "Weekend brunch is back — bottomless mimosas with any entrée. Tag your brunch buddy.", platform: "facebook", views: "2.8k", saves: 96, clicks: 31, img: "/images/dish-2.jpg" },
  { caption: "Behind the pass: chef plating tonight's tasting course. Swipe for the full menu.", platform: "instagram", views: "3.6k", saves: 245, clicks: 39, img: "/images/chef.jpg" },
];

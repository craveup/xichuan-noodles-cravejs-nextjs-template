import type { Metadata } from "next";
import XichuanLocationsPage from "./xichuan-location";

export const metadata: Metadata = {
  title: "Locations - Xichuan Noodles | Find Us Near You",
  description: "Find Xichuan Noodles locations near you. Visit us for authentic Xi'an hand-pulled noodles, traditional Chinese dishes, and exceptional dining experience.",
};

export default function LeclercMenu() {
  return (
    <div>
      <XichuanLocationsPage />
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";

export function XichuanAbout() {
  return (
    <section id="about" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From the ancient capital of Xi&apos;an to your table, we bring the
              authentic flavors of the Silk Road through traditional hand-pulled
              noodles and time-honored recipes.
            </p>
          </div>

          {/* Main Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="max-w-2xl mx-auto text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-6">
                The Art of Hand-Pulled Noodles
              </h3>
              <p className="text-muted-foreground mb-4">
                Our master noodle makers learned their craft in the bustling
                markets of Xi&apos;an, where the rhythmic &quot;biang
                biang&quot; sound of noodles hitting the counter has echoed for
                over a thousand years.
              </p>
              <p className="text-muted-foreground mb-4">
                Each bowl of our signature biang biang noodles tells a story of
                tradition, crafted with flour, water, and generations of
                technique. The noodles are pulled to order, ensuring the perfect
                texture that&apos;s both chewy and tender.
              </p>
              <p className="text-muted-foreground">
                Our secret 30-spice chili oil blend combines the heat of Sichuan
                peppers with the depth of traditional Xi&apos;an seasonings, creating
                a flavor profile that&apos;s bold yet balanced.
              </p>
            </div>
            <div className="relative">
              <img
                src="/images/xichuan-noodles/noodle_making.webp"
                alt="Chef preparing hand-pulled noodles"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Heritage Timeline */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-center mb-12">
              Our Heritage
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white dark:text-white font-bold text-xl"
                  style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                >
                  618
                </div>
                <h4 className="font-semibold mb-2">Tang Dynasty</h4>
                <p className="text-sm text-muted-foreground">
                  Xi&apos;an becomes the starting point of the Silk Road,
                  establishing the culinary traditions that inspire our recipes
                  today.
                </p>
              </div>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white dark:text-white font-bold text-xl"
                  style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                >
                  1995
                </div>
                <h4 className="font-semibold mb-2">
                  Master Chen&apos;s Training
                </h4>
                <p className="text-sm text-muted-foreground">
                  Our head chef begins his apprenticeship in Xi&apos;an&apos;s
                  famous Muslim Quarter, learning the ancient art of hand-pulled
                  noodles.
                </p>
              </div>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white dark:text-white font-bold text-xl"
                  style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                >
                  2024
                </div>
                <h4 className="font-semibold mb-2">Xichuan Opens</h4>
                <p className="text-sm text-muted-foreground">
                  We bring authentic Xi&apos;an flavors to New York, sharing our
                  passion for traditional Chinese noodle cuisine with a new
                  generation.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mb-4">
                <Badge
                  className="text-white dark:text-white"
                  style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                >
                  Authentic
                </Badge>
              </div>
              <h4 className="font-semibold mb-2">Traditional Techniques</h4>
              <p className="text-sm text-muted-foreground">
                Every noodle is hand-pulled using methods passed down through
                generations. No machines, just skill and tradition.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mb-4">
                <Badge
                  className="text-white dark:text-white"
                  style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                >
                  Fresh
                </Badge>
              </div>
              <h4 className="font-semibold mb-2">Made to Order</h4>
              <p className="text-sm text-muted-foreground">
                Each bowl is prepared fresh when you order, ensuring optimal
                texture and flavor in every bite.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mb-4">
                <Badge
                  className="text-white dark:text-white"
                  style={{ backgroundColor: "hsl(var(--brand-accent))" }}
                >
                  Bold
                </Badge>
              </div>
              <h4 className="font-semibold mb-2">Authentic Flavors</h4>
              <p className="text-sm text-muted-foreground">
                Our signature spice blends capture the soul of Xi&apos;an
                cuisine, bold and complex yet perfectly balanced.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

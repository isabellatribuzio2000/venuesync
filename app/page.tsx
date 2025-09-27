import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Mail, Linkedin } from "lucide-react"
import Image from "next/image"

export default function VenueSyncLanding() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <Badge variant="secondary" className="w-fit bg-secondary/20 text-secondary border-secondary/30">
                Currently in stealth mode
              </Badge>

              <div className="space-y-6">
                <h1 className="font-inter font-bold text-4xl md:text-6xl leading-tight text-balance">
                  Music Industry Strategy & Innovation
                </h1>
                <p className="font-poppins text-xl text-muted-foreground leading-relaxed text-pretty">
                  The live entertainment market and streaming platforms operate as separate ecosystems, despite obvious
                  synergies and integration opportunities. VenueSync is developing strategic solutions that bridge this
                  gap.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-poppins font-medium"
                  asChild
                >
                  <a href="/auth/signup">Get Started</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="font-poppins font-medium border-border hover:bg-muted bg-transparent"
                  asChild
                >
                  <a href="/dashboard/artist">Try Demo</a>
                </Button>
              </div>
            </div>

            <div className="animate-fade-in-up animate-delay-200">
              <Card className="p-8 bg-card border-border">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Image
                      src="/images/venuesync-logo.png"
                      alt="VenueSync Logo"
                      width={200}
                      height={200}
                      className="mx-auto rounded-lg"
                      priority
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-12 animate-fade-in-up">
            <div className="text-center space-y-4">
              <h2 className="font-inter font-bold text-3xl md:text-4xl text-balance">
                Strategic Solutions for Music Industry Innovation
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-card border-border hover:border-primary/30 transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-sm"></div>
                  </div>
                  <p className="font-poppins text-foreground leading-relaxed">
                    Working with industry partners to validate and implement next-generation approaches that unlock
                    untapped market opportunities.
                  </p>
                </div>
              </Card>

              <Card className="p-8 bg-card border-border hover:border-primary/30 transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-secondary rounded-sm"></div>
                  </div>
                  <p className="font-poppins text-foreground leading-relaxed">
                    Collaborating with industry leaders to validate strategic integration concepts while maintaining
                    stealth mode operations.
                  </p>
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-card border-border">
              <div className="text-center space-y-4">
                <p className="font-poppins text-lg text-foreground leading-relaxed">
                  Founded by <span className="text-primary font-medium">Lee Parks</span>, combining business strategy
                  expertise with deep music industry insight to identify and develop untapped market opportunities.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center space-y-12 animate-fade-in-up">
            <div className="space-y-4">
              <h2 className="font-inter font-bold text-3xl md:text-4xl text-balance">Partnership & Collaboration</h2>
              <p className="font-poppins text-xl text-muted-foreground">For partnership and collaboration inquiries</p>
            </div>

            <Card className="p-8 bg-card border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <a
                    href="mailto:Info@venuesync.live"
                    className="font-poppins text-lg text-primary hover:text-primary/80 transition-colors"
                  >
                    info@venuesync.live
                  </a>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-poppins font-medium border-border hover:bg-muted bg-transparent"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    Connect on LinkedIn
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="font-poppins text-sm text-muted-foreground">© 2025 VenueSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

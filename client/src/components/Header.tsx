import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ApplicationForm from "./ApplicationForm";
import { Link, useLocation } from "wouter";
import { FileText, ClipboardCheck, Home, Menu } from "lucide-react";

export default function Header() {
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
    <header className="w-full bg-white border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-primary tracking-tight cursor-pointer hover:opacity-80 transition-opacity" data-testid="text-logo">
              Brightside AI
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/">
                    <div className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${location === '/' ? 'bg-accent text-accent-foreground' : ''}`} data-testid="nav-home">
                      <Home className="w-4 h-4" />
                      Home
                    </div>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/templates">
                    <div className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${location === '/templates' ? 'bg-accent text-accent-foreground' : ''}`} data-testid="nav-templates">
                      <FileText className="w-4 h-4" />
                      Templates
                    </div>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/audit">
                    <div className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${location === '/audit' ? 'bg-accent text-accent-foreground' : ''}`} data-testid="nav-audit">
                      <ClipboardCheck className="w-4 h-4" />
                      Free Audit
                    </div>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                data-testid="button-mobile-menu"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${location === '/' ? 'bg-accent text-accent-foreground' : ''}`} data-testid="nav-mobile-home">
                    <Home className="w-4 h-4" />
                    Home
                  </div>
                </Link>
                
                <Link href="/templates" onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${location === '/templates' ? 'bg-accent text-accent-foreground' : ''}`} data-testid="nav-mobile-templates">
                    <FileText className="w-4 h-4" />
                    Templates
                  </div>
                </Link>

                <Link href="/audit" onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${location === '/audit' ? 'bg-accent text-accent-foreground' : ''}`} data-testid="nav-mobile-audit">
                    <ClipboardCheck className="w-4 h-4" />
                    Free Audit
                  </div>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button 
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 text-sm"
            onClick={() => setShowForm(true)}
            data-testid="button-get-appointments"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
    
    {showForm && <ApplicationForm onClose={() => setShowForm(false)} />}
    </>
  );
}
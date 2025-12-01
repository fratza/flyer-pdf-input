import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [storeBranches, setStoreBranches] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    storeCode: "",
    storeName: "",
    url: "",
    file: null as File | null,
  });

  useEffect(() => {
    const fetchStores = async () => {
      const { data, error } = await supabase
        .from("store_branches")
        .select("store_code, store_name");

      if (error) {
        console.error("Error fetching stores:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load store branches.",
        });
      } else {
        setStoreBranches(data || []);
      }
    };

    fetchStores();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url && !formData.file) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide either a URL or attach a file.",
      });
      return;
    }

    const data = new FormData();
    data.append("storeCode", formData.storeCode);
    data.append("storeName", formData.storeName);
    data.append("url", formData.url);
    data.append("submittedAt", new Date().toISOString());
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const webhookUrl = "http://192.168.1.35:5678/webhook/form-input";
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Form Submitted",
        description: "Your store information has been received.",
      });

      setFormData({
        storeCode: "",
        storeName: "",
        url: "",
        file: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit form data.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flyer Input Form
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete the form below to process your flyer
          </p>
        </div>

        <Card className="p-8 bg-card shadow-2xl border-border/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="storeCode"
                className="text-foreground font-medium"
              >
                Store Code
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-background border-border focus:border-primary transition-colors"
                  >
                    {formData.storeCode
                      ? storeBranches.find(
                          (store) => store.store_code === formData.storeCode,
                        )?.store_code
                      : "Select store code..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search store code..." />
                    <CommandList>
                      <CommandEmpty>No store found.</CommandEmpty>
                      <CommandGroup>
                        {storeBranches.map((store) => (
                          <CommandItem
                            key={store.store_code}
                            value={store.store_code}
                            onSelect={() => {
                              setFormData({
                                ...formData,
                                storeCode: store.store_code,
                                storeName: store.store_name,
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.storeCode === store.store_code
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {store.store_code}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="storeName"
                className="text-foreground font-medium"
              >
                Store Name
              </Label>
              <Input
                id="storeName"
                type="text"
                placeholder="Enter store name"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                className="bg-background border-border focus:border-primary transition-colors"
                disabled
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-foreground font-medium">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="bg-background border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-foreground font-medium">
                Attach File
              </Label>
              <div className="relative">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file"
                  className="flex items-center justify-center gap-2 w-full p-4 bg-background border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-all hover:bg-muted/50"
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formData.file
                      ? formData.file.name
                      : "Click to upload file"}
                  </span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            >
              Submit Flyer Information
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
          All fields are required • File size limit: 10MB
        </div>
      </div>
    </div>
  );
};

export default Index;

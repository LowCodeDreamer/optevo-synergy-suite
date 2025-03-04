
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DatePickerFieldProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
}

export const DatePickerField = ({
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  
  // Enhanced function to handle date selection
  const handleSelect = (date: Date | undefined) => {
    console.log("Date selected:", date);
    onChange(date);
    setOpen(false); // Explicitly close the popover after selection
  };
  
  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 z-[100]" 
          align="start"
          sideOffset={4}
        >
          <Calendar 
            mode="single" 
            selected={value} 
            onSelect={handleSelect} 
            initialFocus 
            disabled={false}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};


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
          onPointerDownOutside={(e) => {
            // Prevent clicks from reaching elements underneath
            e.preventDefault();
          }}
          // Force the popover to be on top of everything
          style={{ 
            isolation: "isolate", 
            position: "relative"
          }}
        >
          {/* Create an overlay div that captures all pointer events */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
          
          {/* Ensure calendar container captures all events */}
          <div 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{ 
              position: "relative", 
              zIndex: 10,
              pointerEvents: "auto"
            }}
          >
            <Calendar 
              mode="single" 
              selected={value} 
              onSelect={handleSelect} 
              initialFocus 
              disabled={false}
              // Add additional protection to calendar buttons
              classNames={{
                day: cn(
                  "relative inline-flex items-center justify-center p-0 text-sm font-medium"
                ),
                // Add pointer-events-auto to ensure the calendar day buttons receive clicks
                cell: "relative pointer-events-auto"
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

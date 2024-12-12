import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  return (
    <Popover>
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
        className="w-auto p-0" 
        align="start"
        sideOffset={4}
        style={{ 
          zIndex: 100,
          position: 'relative',
          backgroundColor: 'var(--background)',
          boxShadow: 'var(--shadow)'
        }}
      >
        <Calendar 
          mode="single" 
          selected={value} 
          onSelect={onChange} 
          initialFocus 
        />
      </PopoverContent>
    </Popover>
  );
};
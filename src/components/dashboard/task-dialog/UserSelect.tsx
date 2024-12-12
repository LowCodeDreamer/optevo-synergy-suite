import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string | null;
}

interface UserSelectProps {
  users: User[];
  isLoading: boolean;
  value?: string;
  onChange: (value: string) => void;
}

export const UserSelect = ({ 
  users = [], 
  isLoading, 
  value, 
  onChange 
}: UserSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedUser = users.find((user) => user.id === value);

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        Loading users...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser?.username || "Assign to user"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {(users || []).map((user) => (
              <CommandItem
                key={user.id}
                value={user.username || user.id}
                onSelect={() => {
                  onChange(user.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === user.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.username || "Unnamed User"}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
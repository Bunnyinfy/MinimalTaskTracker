import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TaskForm } from "@/components/task-form";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <ThemeSwitcher />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <TaskForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <TaskList />
      </div>
    </div>
  );
}
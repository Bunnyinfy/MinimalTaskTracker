import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TaskForm } from "@/components/task-form";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { motion } from "framer-motion";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
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
        </motion.div>
        <TaskList />
      </div>
    </motion.div>
  );
}
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Task } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./task-form";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  1: "destructive",
  2: "default",
  3: "secondary",
} as const;

const priorityLabels = {
  1: "High",
  2: "Medium",
  3: "Low",
} as const;

export function TaskCard({ task }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task deleted successfully" });
    },
  });

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Card className="relative transition-colors duration-200 hover:bg-accent/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleMutation.mutate()}
                  className="mt-1"
                />
              </motion.div>
              <div>
                <h3
                  className={`font-semibold ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="transition-colors hover:bg-accent/10">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <TaskForm task={task} />
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="transition-colors hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this task? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMutation.mutate()}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div layout className="flex gap-2">
            <Badge>{task.category}</Badge>
            <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>
              {priorityLabels[task.priority as keyof typeof priorityLabels]}
            </Badge>
            {task.deadline && (
              <Badge variant="outline">
                Due {format(new Date(task.deadline), "PPp")}
              </Badge>
            )}
          </motion.div>
          {task.createdAt && (
            <div className="mt-2 text-xs text-muted-foreground">
              Created {format(new Date(task.createdAt), "PPp")}
              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <> · Updated {format(new Date(task.updatedAt), "PPp")}</>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
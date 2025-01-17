import { Card } from "@/components/ui/card";

interface ProjectPlan {
  objectives: string[];
  team: Array<{ name: string; role: string }>;
  milestones: Array<{ title: string; date: string }>;
  tasks: Array<{ title: string; assignee: string }>;
}

interface ProjectPlanVisualizerProps {
  plan: ProjectPlan;
  phase: "high-level" | "planning" | "detailed";
}

export const ProjectPlanVisualizer = ({ plan, phase }: ProjectPlanVisualizerProps) => {
  return (
    <div className="space-y-4">
      {/* High Level Phase */}
      {phase === "high-level" && (
        <>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Objectives</h3>
            {plan.objectives.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {plan.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No objectives defined yet</p>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Team</h3>
            {plan.team.length > 0 ? (
              <ul className="space-y-2">
                {plan.team.map((member, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{member.name}</span>
                    <span className="text-muted-foreground">{member.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No team members added yet</p>
            )}
          </Card>
        </>
      )}

      {/* Planning Phase */}
      {phase === "planning" && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Milestones</h3>
          {plan.milestones.length > 0 ? (
            <ul className="space-y-2">
              {plan.milestones.map((milestone, index) => (
                <li key={index} className="flex justify-between">
                  <span>{milestone.title}</span>
                  <span className="text-muted-foreground">{milestone.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No milestones defined yet</p>
          )}
        </Card>
      )}

      {/* Detailed Phase */}
      {phase === "detailed" && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Tasks</h3>
          {plan.tasks.length > 0 ? (
            <ul className="space-y-2">
              {plan.tasks.map((task, index) => (
                <li key={index} className="flex justify-between">
                  <span>{task.title}</span>
                  <span className="text-muted-foreground">{task.assignee}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No tasks created yet</p>
          )}
        </Card>
      )}
    </div>
  );
};
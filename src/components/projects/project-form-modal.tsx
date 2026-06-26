"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { TextField } from "@/components/ui/text-field";
import { ApiError } from "@/lib/api-client";
import { projectSchema } from "@/lib/validation";
import { PROJECT_STATUSES, STATUS_LABELS } from "@/lib/constants";
import type { ProjectDTO } from "@/lib/projects";
import { useCreateProject, useUpdateProject } from "@/hooks/use-project-mutations";

type Props = {
  open: boolean;
  project: ProjectDTO | null;
  onClose: () => void;
  onSaved: (message: string) => void;
};

type FormState = {
  name: string;
  status: string;
  deadline: string;
  assignee: string;
  budget: string;
};

function initialState(project: ProjectDTO | null): FormState {
  return {
    name: project?.name ?? "",
    status: project?.status ?? "ACTIVE",
    deadline: project ? project.deadline.slice(0, 10) : "",
    assignee: project?.assignee ?? "",
    budget: project ? String(project.budget) : "",
  };
}

export function ProjectFormModal({ open, project, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(initialState(project));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const create = useCreateProject();
  const update = useUpdateProject();
  const isEditing = project !== null;
  const submitting = create.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setForm(initialState(project));
      setErrors({});
    }
  }, [open, project]);

  const setField = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      if (isEditing) {
        await update.mutateAsync({ id: project.id, input: parsed.data });
      } else {
        await create.mutateAsync(parsed.data);
      }
      onSaved(isEditing ? "Project updated" : "Project created");
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      else setErrors({ form: err instanceof ApiError ? err.message : "Something went wrong" });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit project" : "Add project"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Deadline"
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={(e) => setField("deadline", e.target.value)}
          error={errors.deadline}
        />
        <TextField
          label="Assignee"
          name="assignee"
          value={form.assignee}
          onChange={(e) => setField("assignee", e.target.value)}
          error={errors.assignee}
        />
        <TextField
          label="Budget"
          name="budget"
          type="number"
          min="0"
          step="0.01"
          value={form.budget}
          onChange={(e) => setField("budget", e.target.value)}
          error={errors.budget}
        />

        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? "Saving…" : isEditing ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

export function ConfirmDeleteButton({
  action,
  label = "删除",
}: {
  action: (formData: FormData) => void;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`确定要${label}吗?此操作不可撤销。`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm text-red-500 transition-colors hover:text-red-700"
      >
        {label}
      </button>
    </form>
  );
}

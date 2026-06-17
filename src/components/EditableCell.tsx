import Input from "./Input";

type EditableCellProps = {
  value: string | number | null;
  field: string;
  rowId: string;
  error?: string | null;
  onChange: (id: string, field: string, value: string) => void;
  type?: string;
};

export function EditableCell({
  value,
  field,
  rowId,
  error,
  onChange,
  type = "text",
}: EditableCellProps) {
  return (
    <div className="cell-editor">
      <Input
        className={`form-input ${
          error ? "border-red-500" : ""
        }`}
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(rowId, field, e.target.value)
        }
      />

      {error && (
        <span className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}

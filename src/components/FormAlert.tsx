type FormAlertProps = {
  message: string;
};

export default function FormAlert({ message }: FormAlertProps) {
  return (
    <div className="form-alert" role="alert">
      {message}
    </div>
  );
}

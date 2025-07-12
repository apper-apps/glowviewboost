import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required, 
  type = "input",
  className,
  children,
  ...props 
}) => {
  const Component = type === "textarea" ? Textarea : Input;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={required ? "after:content-['*'] after:text-error after:ml-1" : ""}>
          {label}
        </Label>
      )}
      {children || <Component {...props} />}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;
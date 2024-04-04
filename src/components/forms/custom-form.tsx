"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import RequiredStar from "./required-star";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, zPriority } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import FileUpload from "@/components/global/file-upload";
import { TFileUploadTypes } from "@/lib/types";

interface CustomInputProps {
  form: UseFormReturn<any>;
  name: string;
  formLabel: string;
  isRequired?: boolean;
  formDescription?: string;
  className?: string;
  formItemClassName?: string;
  selectTriggerClassName? : string;
  disabled?: boolean;
  readOnly?: boolean;
}

type ConditionalProps =
  | {
      type: "text";
      placeholder: string;
      selectData?: never;
      apiEndPoint? : never;
    }
  | {
      type: "number";
      placeholder: string;
      selectData?: never;
      apiEndPoint? : never;
    }
  | {
      type: "textarea";
      placeholder: string;
      selectData?: never;
      apiEndPoint? : never;
    }
  | {
      type: "checkbox";
      placeholder?: never;
      selectData?: never;
      apiEndPoint? : never;
    }
  | {
      type: "switch";
      placeholder?: never;
      selectData?: never;
      apiEndPoint? : never;
    }
  | {
      type: "select";
      placeholder: string;
      selectData: {id: string, value : string , title : string}[];
      apiEndPoint? : never;
    }
  | {
      type: "file-upload";
      placeholder?: never;
      selectData?: never;
      apiEndPoint : TFileUploadTypes;
    };

type CustomFormProps = CustomInputProps & ConditionalProps;

const CustomForm = ({
  form,
  name,
  formLabel,
  placeholder,
  apiEndPoint,
  isRequired,
  type,
  formDescription,
  className,
  formItemClassName,
  selectTriggerClassName,
  selectData,
  disabled,
  readOnly,
}: CustomFormProps) => {
  console.log(form.watch("role"));
  
  return (
    <div className={cn("w-full", className)}>
      <FormField
        disabled={disabled}
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("w-full", formItemClassName)}>
            {type !== "checkbox" && (
              <FormLabel>
                {formLabel} {isRequired && <RequiredStar />}
              </FormLabel>
            )}

            {type === "text" && (
              <FormControl>
                <Input
                  readOnly={readOnly}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
            )}

            {type === "number" && (
              <FormControl>
                <Input
                  readOnly={readOnly}
                  type="number"
                  inputMode="numeric"
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
            )}

            {type === "textarea" && (
              <FormControl>
                <Textarea
                  readOnly={readOnly}
                  placeholder={placeholder}
                  rows={5}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            )}

            {type === "checkbox" && (
              <>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{formLabel}</FormLabel>
                </div>
              </>
            )}

            {type === "select" && (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={cn("w-full max-w-[250px]", selectTriggerClassName)}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>

                <SelectContent >
                  {selectData?.map(({ id, value, title }) => (
                    <SelectItem key={id} value={value}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {type === "switch" && (
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            )}

            {type === "file-upload" && (
              <FormControl>
              <FileUpload
                apiEndpoint={apiEndPoint}
                onChange={field.onChange}
                value={field.value}
                disabled={disabled}
              />
            </FormControl>
            )}

            {formDescription && (
              <FormDescription>{formDescription}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomForm;

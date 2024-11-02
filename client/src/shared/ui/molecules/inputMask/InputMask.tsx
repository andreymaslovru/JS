/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input as AntdInput, InputProps, InputRef } from 'antd'
import IMask, { AnyMaskedOptions, MaskedPattern } from 'imask'
import { useState, useMemo, RefAttributes } from 'react'

type SubmitOptions =
  | {
      unmask: false;
      fixedChars?: never;
    }
  | {
      unmask: true;
      fixedChars?: string;
    };

type InputPropsType = InputProps &
  RefAttributes<InputRef> & {
    mask: AnyMaskedOptions['mask'];
    definitions?: MaskedPattern['definitions'];
    maskOptions?: AnyMaskedOptions & { lazy: never };
    submitOptions?: SubmitOptions;
  };

export const InputMask = ({
  value,
  defaultValue,
  ref,
  mask,
  definitions,
  maskOptions: _maskOptions,
  submitOptions = { unmask: true },
  ...props
}: InputPropsType) => {
  const { unmask, fixedChars } = submitOptions
  const maskOptions = useMemo(() => {
    return {
      mask,
      definitions: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ..._maskOptions?.definitions,
        ...definitions
      },
      ..._maskOptions,
      lazy: true // make placeholder always hidden
    } as AnyMaskedOptions
  }, [_maskOptions, definitions, mask])

  const masked = {
    mask: IMask.createPipe(
      maskOptions,
      IMask.PIPE_TYPE.MASKED,
      IMask.PIPE_TYPE.TYPED
    ),
    unmask: (value: string) => {
      const unmasked = IMask.pipe(
        value,
        maskOptions,
        IMask.PIPE_TYPE.MASKED,
        IMask.PIPE_TYPE.UNMASKED
      )
      return fixedChars
        ? value
          .split('')
          .filter((char) => (fixedChars + unmasked).includes(char))
          .join('')
        : unmasked
    }
  }
  const initialValue = masked.mask(value || defaultValue || '')
  const [fieldValue, setFieldValue] = useState(initialValue)

  const handleChange = (event: any) => {
    const input = event.target
    const maskedValue = masked.mask(input.value)
    input.value = unmask ? masked.unmask(maskedValue) : maskedValue
    setFieldValue(maskedValue)
    if (props.onChange) props.onChange(event)
  }

  const handleKey = (e: any) => {
    e.target.selectionEnd = e.target.selectionStart
  }

  return (
    <AntdInput
      {...props}
      value={fieldValue}
      onKeyPress={handleKey}
      onChange={handleChange}
    />
  )
}

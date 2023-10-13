import React from 'react';

type InputFieldProps = {
    register: any;
    name: string;
    type: string;
    placeholder: string;
    label: string;
    validation?: any;
    errors?: any;
};

const InputField: React.FC<InputFieldProps> = ({
    register,
    name,
    type,
    placeholder,
    label,
    validation,
    errors,
}) => {
    console.log(errors)
    return (
        <>
            <label
                htmlFor={`input-${name}`}
                className='block text-sm font-bold my-2'
            >
                {label}:
            </label>
            <input
                {...register(name, validation)}
                type={type}
                id={`input-${name}`}
                className={`opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm ${
                    errors?.[name] ? 'border-red-600' : 'focus:border-blue-500'
                } focus:ring-blue-500 w-full`}
                placeholder={placeholder}
            />
            {errors?.[name] && (
                <p className='text-red-600'>{errors[name].message}</p>
            )}
        </>
    );
};

export default InputField;

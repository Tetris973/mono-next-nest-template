interface FormInputs {
  [key: string]: string;
}

/**
 * Utility function to create a form element with specified input fields and values.
 * @param inputs - An object where keys are input field names and values are input field values.
 * @returns A form element containing the specified inputs.
 */
export const createFormElement = (inputs: FormInputs): HTMLFormElement => {
  const formElement = document.createElement('form');

  Object.entries(inputs).forEach(([name, value]) => {
    const inputElement = document.createElement('input');
    inputElement.name = name;
    inputElement.value = value;
    formElement.appendChild(inputElement);
  });

  return formElement;
};

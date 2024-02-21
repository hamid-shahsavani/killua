import { useFormik } from 'formik';
import { useKillua } from 'killua-beta';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { todosSlice } from '@/slices/todos';
import { generateUniqueId } from '@/utils/generate-unique-id';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAddTodo(props: IProps): JSX.Element {
  // add todo to to localstorage / get todos length
  const localStorageTodos = useKillua(todosSlice);

  // formik
  interface IFormik {
    title: string;
    description: string;
  }
  const formikConstant = {
    fields: {
      title: {
        label: 'Title',
        placeholder: 'type title here ...',
        type: 'input',
        errors: {
          isRequired: 'Title is required!'
        }
      },
      description: {
        label: 'Description',
        placeholder: 'type description here ...',
        type: 'textarea',
        errors: {
          isRequired: 'Description is required!',
          mustBeAtLeast4Characters:
            'Description must be at least 8 characters!',
          canBeUpTo300Characters: 'Description can be up to 300 characters!'
        }
      }
    },
    title: 'Add Todo',
    submit: 'Add Todo'
  };
  const formik = useFormik<IFormik>({
    initialValues: {
      title: '',
      description: ''
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        title: z.string({
          required_error: formikConstant.fields.title.errors.isRequired
        }),
        description: z
          .string({
            required_error: formikConstant.fields.description.errors.isRequired
          })
          .min(
            4,
            formikConstant.fields.description.errors.mustBeAtLeast4Characters
          )
          .max(
            300,
            formikConstant.fields.description.errors.canBeUpTo300Characters
          )
      })
    ),
    onSubmit: async values => {
      // add todo to localstorage
      localStorageTodos.reducers.add({
        id: generateUniqueId(),
        title: values.title,
        description: values.description,
        status: 'todo'
      });
      // close modal / reset form
      props.onClose();
      formik.resetForm();
    }
  });

  return (
    <section
      className={`fixed inset-0 z-50 flex h-screen w-screen items-center justify-center backdrop-blur-[2px] transition-all duration-500 ${
        props.isOpen ? 'visible bg-black/20' : 'invisible opacity-0'
      }`}
    >
      <div
        className={`flex w-full items-center justify-center transition-all duration-300 ${
          props.isOpen
            ? 'visible scale-100 opacity-100'
            : 'invisible scale-75 lg:opacity-0'
        }`}
      >
        <div
          onClick={(): void => {
            props.onClose();
            formik.resetForm();
          }}
          className="fixed inset-0"
        />
        <div className="rounded-lg w-full mx-5 max-w-[400px] bg-gradient-to-r from-[#D931F7]/80 via-[#D931F7]/80 to-[#F3F731]/80 p-[1px]">
          <div className="relative flex flex-col gap-4 rounded-lg bg-black p-5">
            {/* head */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {/* title */}
                <p className="text-[17px] font-semibold">
                  {formikConstant.title}
                </p>
                {/* close btn */}
                <button
                  onClick={(): void => {
                    props.onClose();
                    formik.resetForm();
                  }}
                  className="btn-animation"
                >
                  <img src={'/icons/xmark.svg'} alt="close" />
                </button>
              </div>
            </div>
            {/* body */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* fields */}
              <div className="space-y-7 [&_.field]:relative [&_.field]:my-1 [&_.field]:rounded-md [&_.field]:border [&_.field]:p-3 [&_input::placeholder]:text-sm [&_input]:w-full [&_input]:truncate [&_input]:bg-transparent [&_input]:text-sm [&_label]:absolute [&_label]:-top-3.5 [&_label]:left-2.5 [&_label]:w-fit [&_label]:bg-black [&_label]:p-1 [&_label]:text-sm [&_textarea::placeholder]:text-sm [&_textarea]:w-full [&_textarea]:truncate [&_textarea]:bg-transparent [&_textarea]:text-sm">
                {/* title */}
                <div>
                  <div
                    className={`field ${
                      formik.errors.title && formik.touched.title
                        ? '!border-red-500'
                        : '!border-gray-600'
                    }`}
                  >
                    <label
                      className={
                        formik.errors.title && formik.touched.title
                          ? 'text-red-500'
                          : 'text-white'
                      }
                    >
                      {formikConstant.fields.title.label}
                    </label>
                    <input
                      {...formik.getFieldProps('title')}
                      type="text"
                      placeholder={formikConstant.fields.title.placeholder}
                    />
                  </div>
                  {formik.errors.title && formik.touched.title ? (
                    <span className="ml-1.5 pt-0.5 text-sm text-red-500">
                      {formik.errors.title}
                    </span>
                  ) : null}
                </div>
                {/* description */}
                <div>
                  <div
                    className={`field ${
                      formik.errors.description && formik.touched.description
                        ? '!border-red-500'
                        : '!border-gray-600'
                    }`}
                  >
                    <label
                      className={
                        formik.errors.description && formik.touched.description
                          ? 'text-red-500'
                          : 'text-white'
                      }
                    >
                      {formikConstant.fields.description.label}
                    </label>
                    <textarea
                      {...formik.getFieldProps('description')}
                      className="max-h-[150px] min-h-[150px]"
                      placeholder={
                        formikConstant.fields.description.placeholder
                      }
                    />
                  </div>
                  {formik.errors.description && formik.touched.description ? (
                    <span className="ml-1.5 pt-0.5 text-sm text-red-500">
                      {formik.errors.description}
                    </span>
                  ) : null}
                </div>
              </div>
              {/* submit btn */}
              <button
                type="submit"
                className="btn-animation w-full rounded-lg text-white bg-purple-700 p-4 text-center font-medium"
              >
                {formikConstant.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

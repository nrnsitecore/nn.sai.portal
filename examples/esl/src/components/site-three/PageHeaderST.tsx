import {
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  Image as ContentSdkImage,
  ImageField,
  Field,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Title: Field<string>;
  Body: RichTextField;
  Image: ImageField;
}

type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: Fields;
};

/** Shared type scale so all five page-header variants stay in step. */
const pageHeaderTitleClass = 'text-3xl lg:text-5xl';
const pageHeaderBodyClass = 'text-base lg:text-lg';

/** Primary bar that anchors a page-header title. */
const PageHeaderAccentBar = () => (
  <span aria-hidden className="mb-5 block h-1 w-12 rounded-full bg-primary" />
)

export const Default = (props: PageHeaderSTProps) => {
  if (!props.fields) {
    return null;
  }

  return (
    <section
      className={`relative min-h-[18rem] lg:min-h-[30rem] flex items-center py-16 lg:py-20 ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <ContentSdkImage
          field={props.fields?.Image}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="bg-dark/65 absolute inset-0" aria-hidden />
      </div>
      <div className="relative container px-4 mx-auto z-20">
        <div className="grid gap-8 items-center w-full lg:grid-cols-2 lg:gap-12">
          <div>
            <PageHeaderAccentBar />
            <h1 className={`text-white ${pageHeaderTitleClass}`}>
              <ContentSdkText field={props.fields?.Title} />
            </h1>
          </div>
          <div className={`text-white/90 ${pageHeaderBodyClass}`}>
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const TextRight = (props: PageHeaderSTProps) => {
  if (!props.fields) {
    return null;
  }

  return (
    <section
      className={`relative min-h-[18rem] lg:min-h-[30rem] flex items-center py-16 lg:py-20 ${props.params.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <ContentSdkImage
          field={props.fields?.Image}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20"
          aria-hidden
        />
      </div>
      <div className="relative container px-4 mx-auto z-20">
        <div className="grid gap-6 max-w-[36rem]">
          <div>
            <PageHeaderAccentBar />
            <h1 className={`text-white ${pageHeaderTitleClass}`}>
              <ContentSdkText field={props.fields?.Title} />
            </h1>
          </div>
          <div className={`text-white/90 ${pageHeaderBodyClass}`}>
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const SplitScreen = (props: PageHeaderSTProps) => {
  if (!props.fields) {
    return null;
  }

  return (
    <section
      className={`esl-band relative min-h-[18rem] lg:min-h-[30rem] flex flex-col lg:flex-row items-center pb-14 lg:py-20 ${props.params.styles}`}
      data-class-change
    >
      <div className="w-full mb-14 lg:absolute lg:inset-0 lg:mb-0 lg:z-10">
        <ContentSdkImage
          field={props.fields?.Image}
          width={1920}
          height={1080}
          className="w-full h-[20rem] lg:h-full object-cover lg:w-1/2 lg:ml-auto"
        />
      </div>
      <div className="relative container px-4 mx-auto z-20">
        <div className="grid gap-6 lg:max-w-[50%] pr-8">
          <div>
            <PageHeaderAccentBar />
            <h1 className={pageHeaderTitleClass}>
              <ContentSdkText field={props.fields?.Title} />
            </h1>
          </div>
          <div className={pageHeaderBodyClass}>
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: PageHeaderSTProps) => {
  if (!props.fields) {
    return null;
  }

  return (
    <section className={`relative py-16 lg:py-20 ${props.params.styles}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="grid gap-x-12 gap-y-6 items-center w-full lg:grid-cols-2">
          <div>
            <PageHeaderAccentBar />
            <h1 className={pageHeaderTitleClass}>
              <ContentSdkText field={props.fields?.Title} />
            </h1>
          </div>
          <div className={pageHeaderBodyClass}>
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>
      </div>
      <ContentSdkImage
        field={props.fields.Image}
        width={1920}
        height={1080}
        className="w-full h-[20rem] object-cover mt-14 lg:h-[33rem]"
      />
    </section>
  );
};

export const TwoColumn = (props: PageHeaderSTProps) => {
  if (!props.fields) {
    return null;
  }

  return (
    <section
      className={`esl-band relative pt-16 lg:pt-20 ${props.params.styles}`}
      data-class-change
    >
      <div className="container px-4 mx-auto">
        <div className="grid gap-x-12 gap-y-8 w-full lg:grid-cols-2">
          <div>
            <PageHeaderAccentBar />
            <h1 className={`${pageHeaderTitleClass} mb-6`}>
              <ContentSdkText field={props.fields?.Title} />
            </h1>
            <div className={pageHeaderBodyClass}>
              <ContentSdkRichText field={props.fields?.Body} />
            </div>
          </div>
          <ContentSdkImage
            field={props.fields?.Image}
            width={1080}
            height={1080}
            className="w-full h-full aspect-3/2 object-cover lg:aspect-square"
          />
        </div>
      </div>
    </section>
  );
};

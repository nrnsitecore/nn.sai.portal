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
  Image1: ImageField;
  Image2: ImageField;
  Image3: ImageField;
}

type ImageBannerProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ImageBannerProps) => {
  return (
    <section className={`relative py-16 ${props.params?.styles || ''}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="esl-heading-bar-center text-3xl lg:text-4xl mb-6">
            <ContentSdkText field={props.fields?.Title} />
          </h2>
          <div className="text-muted-foreground text-base">
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>
      </div>
      <div className="container mx-auto sm:px-4">
        <div className="grid grid-cols-3 items-center mt-16">
          <div className="aspect-11/10">
            <ContentSdkImage
              field={props.fields?.Image1}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="aspect-9/10">
            <ContentSdkImage
              field={props.fields?.Image2}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="aspect-11/10">
            <ContentSdkImage
              field={props.fields?.Image3}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Grid = (props: ImageBannerProps) => {
  return (
    <section className={`relative py-16 ${props.params?.styles || ''}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="esl-heading-bar-center text-3xl lg:text-4xl mb-6">
            <ContentSdkText field={props.fields?.Title} />
          </h2>
          <div className="text-muted-foreground text-base">
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>

        <div className="grid grid-cols-16 mt-16">
          <div className="aspect-8/3 col-span-9">
            <ContentSdkImage
              field={props.fields?.Image1}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="col-span-7 row-span-2">
            <ContentSdkImage
              field={props.fields?.Image2}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="aspect-4/3 col-span-9">
            <ContentSdkImage
              field={props.fields?.Image3}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const FullWidthRow = (props: ImageBannerProps) => {
  return (
    <section className={`relative py-16 ${props.params?.styles || ''}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="esl-heading-bar-center text-3xl lg:text-4xl mb-6">
            <ContentSdkText field={props.fields?.Title} />
          </h2>
          <div className="text-muted-foreground text-base">
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-24 mt-16">
        <div className="col-span-7 h-64 lg:h-84">
          <ContentSdkImage
            field={props.fields?.Image1}
            width={1920}
            height={1080}
            className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
        <div className="col-span-10 h-64 lg:h-84">
          <ContentSdkImage
            field={props.fields?.Image2}
            width={1920}
            height={1080}
            className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
        <div className="col-span-7 h-64 lg:h-84">
          <ContentSdkImage
            field={props.fields?.Image3}
            width={1920}
            height={1080}
            className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
};

export const SingleRowGrid = (props: ImageBannerProps) => {
  return (
    <section className={`relative py-16 ${props.params?.styles || ''}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="esl-heading-bar-center text-3xl lg:text-4xl mb-6">
            <ContentSdkText field={props.fields?.Title} />
          </h2>
          <div className="text-muted-foreground text-base">
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>

        <div className="grid grid-cols-10 gap-4 mt-16">
          <div className="col-span-3 h-64 lg:h-84 mt-10">
            <ContentSdkImage
              field={props.fields?.Image1}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="col-span-4 h-64 lg:h-84">
            <ContentSdkImage
              field={props.fields?.Image2}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="col-span-3 h-64 lg:h-84 mt-10">
            <ContentSdkImage
              field={props.fields?.Image3}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: ImageBannerProps) => {
  return (
    <section className={`relative py-16 ${props.params?.styles || ''}`} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="esl-heading-bar-center text-3xl lg:text-4xl mb-6">
            <ContentSdkText field={props.fields?.Title} />
          </h2>
          <div className="text-muted-foreground text-base">
            <ContentSdkRichText field={props.fields?.Body} />
          </div>
        </div>
      </div>
      <div className="container mx-auto sm:px-4">
        <div className="grid grid-cols-12 items-center gap-y-4 sm:gap-y-8 md:gap-y-10 lg:gap-y-16 mt-16">
          <div className="col-span-5 aspect-square">
            <ContentSdkImage
              field={props.fields?.Image1}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="col-span-6 col-start-7 aspect-square">
            <ContentSdkImage
              field={props.fields?.Image2}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className="col-span-7 col-start-3 aspect-square">
            <ContentSdkImage
              field={props.fields?.Image3}
              width={1920}
              height={1080}
              className="h-full w-full rounded-2xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

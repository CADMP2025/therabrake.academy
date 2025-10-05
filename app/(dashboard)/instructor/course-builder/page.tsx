import dynamic from "next/dynamic";

const IntegratedCourseBuilder = dynamic(
  () => import("@/components/course/IntegratedCourseBuilder").then(mod => mod.IntegratedCourseBuilder),
  { 
    ssr: false,
    loading: () => <div>Loading course builder...</div>
  }
);

export default function CourseBuilderPage() {
  return <IntegratedCourseBuilder />;
}

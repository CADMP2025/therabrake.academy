import dynamic from "next/dynamic";
const CourseBuilder = dynamic(() => import("@/components/course/CourseBuilder"), { 
  ssr: false 
});

export default function CourseBuilderPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cut & Paste Course Builder</h1>
      <CourseBuilder />
    </div>
  );
}

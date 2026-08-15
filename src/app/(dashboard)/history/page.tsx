import { HistoryContent } from "@/components/history/history-content";

export const metadata = {
  title: "History",
};

export default function HistoryPage() {
  return (
    <div className="flex flex-1 flex-col gap-6.5 p-5 lg:px-12 lg:py-10">
      <HistoryContent />
    </div>
  );
}

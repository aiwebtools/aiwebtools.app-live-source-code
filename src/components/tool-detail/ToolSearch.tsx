
import SearchBar from "@/components/tools/SearchBar";

interface ToolSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalTools: number;
}

const ToolSearch = ({ searchTerm, onSearchChange, totalTools }: ToolSearchProps) => {
  // Create a version of search change that doesn't auto-navigate
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    // Don't auto-navigate on typing - let the SearchBar handle result selection
  };

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 cyber-glow">
          Discover More AI Tools
        </h3>
        <p className="text-gray-300 mb-6">Search through our collection of {totalTools.toLocaleString()} AI tools to find your next favorite</p>
      </div>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        preventAutoNavigation={true}
      />
    </div>
  );
};

export default ToolSearch;

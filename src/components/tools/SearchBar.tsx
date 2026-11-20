import GlobalSearchInput from "@/components/search/GlobalSearchInput";
import { MARKETING_TOOL_COUNT } from "@/data/generated/toolCount";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  preventAutoNavigation?: boolean;
}
const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => (
  <GlobalSearchInput searchTerm={searchTerm} onSearchChange={onSearchChange}
    toolStats={{ marketing: MARKETING_TOOL_COUNT }} onClear={() => onSearchChange("")}
    onKeyDown={event => { if (event.key === "Enter") event.preventDefault(); }} />
);
export default SearchBar;

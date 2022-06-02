import { Wrapper } from "./styles";

type SearchBarProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Wrapper>
      <input placeholder='Search...' onChange={onChange} value={value} />
    </Wrapper>
  );
}

export default SearchBar;

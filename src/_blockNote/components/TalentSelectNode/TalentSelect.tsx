import { useEffect, useState } from "react";

interface TalentSelectProps {
  inlineContent: any;
  updateInlineContent: any;
  contentRef: any;
}

const TalentSelect = (props: TalentSelectProps) => {
  const value = props.inlineContent?.props?.talent || "";
  const [options, setOptions] = useState<string[]>([value].filter(Boolean));

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=5")
      .then((res) => res.json())
      .then((data) => {
        setOptions([
          value,
          ...// @ts-ignore
          data.results.map((result) =>
            [result.name.first, result.name.last].join(" ")
          ),
        ]);
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    if (props.updateInlineContent && newValue) {
      try {
        props.updateInlineContent({
          type: props.inlineContent.type,
          props: {
            ...props.inlineContent.props,
            talent: newValue,
          },
        });
      } catch (error) {
        console.log("Could not update talent:", error);
      }
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      style={{
        minWidth: "120px",
        fontSize: "14px",
        display: "inline-block",
        backgroundColor: "#333333",
        color: "white",
        border: "1px solid #555",
        borderRadius: "4px",
        padding: "4px 8px",
        outline: "none",
      }}
    >
      {!value && <option value="">Select talent</option>}
      {options.map((option, index) => (
        <option
          key={index}
          value={option}
          style={{ backgroundColor: "#333333", color: "white" }}
        >
          {option}
        </option>
      ))}
    </select>
  );
};

export default TalentSelect;

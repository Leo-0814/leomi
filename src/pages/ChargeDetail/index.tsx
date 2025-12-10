import { useParams } from "react-router-dom";

const ChargeDetail = () => {
  const { id } = useParams();
  console.log(id);

  const fakeData = {
    id: 1,
    name: "12月開銷",
    amount: 1000,
    date: "2025-12-10",
    category: "生活",
    description: "12月開銷",
    tags: ["生活", "飲食", "交通"],
    isIncome: false,
    isExpense: true,
  };

  return (
    <div className="w-[90%] mx-auto py-8 min-h-screen flex flex-col gap-4">
      <div className="text-2xl">{fakeData.name}</div>
    </div>
  );
};

export default ChargeDetail;

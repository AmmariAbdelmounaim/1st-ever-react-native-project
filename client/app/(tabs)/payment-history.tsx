import PaymentHistoryCard from "@/components/payment-history-card";
import { useHistory } from "@/lib/hooks/use-history";
import { ScrollView, View } from "react-native";

function PaymentHistory() {
  const { history } = useHistory();

  return (
    <ScrollView className="px-2 bg-muted">
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        {history.length > 0 &&
          history.map((hist, index) => (
            <PaymentHistoryCard
              key={index}
              amount={hist.amount / 100}
              date={hist.date}
            />
          ))}
      </View>
    </ScrollView>
  );
}

export default PaymentHistory;

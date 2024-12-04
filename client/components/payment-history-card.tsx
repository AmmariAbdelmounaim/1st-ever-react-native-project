import React from "react";
import { Card, CardContent } from "./ui/card";
import { View } from "react-native";
import { Text } from "./ui";

interface PaymentHistoryCardProps {
  amount: number;
  date: string;
}

function PaymentHistoryCard({ amount, date }: PaymentHistoryCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <View
          className="justify-between items-center"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Text className="font-semibold text-lg">${amount.toFixed(2)}</Text>
          <Text className="text-sm text-gray-500">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}

export default PaymentHistoryCard;

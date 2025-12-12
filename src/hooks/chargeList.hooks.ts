import dayjs from "dayjs";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  QuerySnapshot,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { firebaseRequest } from "../apis";
import type { FirebaseRequestOptions } from "../apis/data";
import type { ChargeListParamsType } from "../interfaces/chargeList";
import { dbCloud } from "../plugins/firebase";

export const addChargeItem = ({
  params,
  options,
}: {
  params: ChargeListParamsType;
  options: FirebaseRequestOptions;
}) => {
  firebaseRequest({
    action: () => {
      const counterRef = doc(dbCloud, "counters", "chargeListsCount");
      const newChargeListRef = doc(collection(dbCloud, "charge_lists")); // 先獲取一個新的文件參考（ID稍後決定）
      const settingsRef = doc(dbCloud, "settings/G0Zj1c9s7EzzIcVbIHbY");

      const initData = {
        name: params.name,
        driver: {},
        driver_value: 0,
        food: {},
        food_value: 0,
        other: {},
        other_value: 0,
        total_value: 0,
        fixed_income: {},
        fixed_income_value: 0,
        fixed_expenses: {},
        fixed_expenses_value: 0,
        createdAt: dayjs().unix(),
      };

      return runTransaction(dbCloud, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const settingsDoc = await transaction.get(settingsRef);
        if (!settingsDoc.exists()) {
          console.debug("settingsDoc not exists");
        }
        let newId: number = 0;
        if (!counterDoc.exists()) {
          // 如果計數器不存在，則初始化它
          transaction.set(counterRef, { currentId: 1 });
          newId = 1;
        }

        // 讀取當前 ID，並計算下一個 ID
        newId = counterDoc.data()?.currentId
          ? counterDoc.data()?.currentId + 1
          : 1;

        // 在交易中，將新文件寫入 charge_lists 集合，並指定 ID
        transaction.set(newChargeListRef, {
          id: newId, // 將遞增的數字存為欄位，而不是文件 ID
          ...initData,
          ...(settingsDoc.exists() ? settingsDoc.data() : {}),
        });

        // 更新計數器為下一個 ID
        transaction.update(counterRef, { currentId: newId });

        return newId;
      });
    },
    options,
  });
};

export const editChargeItem = ({
  params,
  options,
}: {
  params: ChargeListParamsType;
  options: FirebaseRequestOptions;
}) => {
  firebaseRequest({
    action: async () => {
      const chargeItemRef = doc(dbCloud, "charge_lists", params.id || "");
      // 只更新 visited 欄位
      await updateDoc(chargeItemRef, {
        name: params.name,
      });
    },
    options,
  });
};

export const getChargeList = async (callback: (doc: QuerySnapshot) => void) => {
  const q = query(collection(dbCloud, "charge_lists"), orderBy("id", "desc"));
  const querySnapshot = await getDocs(q);
  callback(querySnapshot);
};

export const deleteChargeItem = ({
  params,
  options,
}: {
  params: ChargeListParamsType;
  options: FirebaseRequestOptions;
}) => {
  firebaseRequest({
    action: async () => {
      await deleteDoc(doc(dbCloud, "charge_lists", params.id || ""));
    },
    options,
  });
};

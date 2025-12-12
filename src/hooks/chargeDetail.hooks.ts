import dayjs from "dayjs";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { firebaseRequest } from "../apis";
import type { FirebaseRequestOptions } from "../apis/data";
import type {
  ChargeDetailItemParamsType,
  ChargeDetailParamsType,
} from "../interfaces/chargeDetail";
import { dbCloud } from "../plugins/firebase";

export const getChargeDetail = async ({
  params,
}: {
  params: ChargeDetailParamsType;
}) => {
  const docRef = doc(dbCloud, "charge_lists", params.id || "");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.debug("找不到該文件!");
  }
};

export const addChargeDetailItem = ({
  params,
  options,
}: {
  params: ChargeDetailItemParamsType;
  options: FirebaseRequestOptions;
}) => {
  firebaseRequest({
    action: async () => {
      const parentDocRef = doc(dbCloud, "charge_lists", params.parentId || "");
      await runTransaction(dbCloud, async (transaction) => {
        // --- A. 讀取目前的父文件資料 (鎖定資料) ---
        const parentDocSnap = await transaction.get(parentDocRef);
        if (!parentDocSnap.exists()) {
          throw new Error("Parent Document does not exist!");
        }

        const currentItemTotal =
          parentDocSnap.data()[`${params.type}_value`] || 0;
        const newItemTotal = currentItemTotal + (params.value || 0);

        const currentTotal = parentDocSnap.data().total_value || 0;
        const newTotal = currentTotal - (params.value || 0);

        const currentItem = parentDocSnap.data()[`${params.type}`] || {};
        const newItem = {
          name: params.name,
          value: params.value,
          date: params.date,
          createdAt: dayjs().unix(),
        };
        const newItems = { ...currentItem, [dayjs().unix()]: newItem };

        transaction.update(parentDocRef, {
          [`${params.type}_value`]: newItemTotal,
          total_value: newTotal,
          [`${params.type}`]: newItems,
        });
        return newItemTotal;
      });
    },
    options,
  });
};

export const editChargeDetailItem = ({
  params,
  options,
}: {
  params: ChargeDetailItemParamsType;
  options: FirebaseRequestOptions;
}) => {
  firebaseRequest({
    action: async () => {
      const parentDocRef = doc(dbCloud, "charge_lists", params.parentId || "");

      await runTransaction(dbCloud, async (transaction) => {
        // --- A. 讀取目前的父文件資料 (鎖定資料) ---
        const parentDocSnap = await transaction.get(parentDocRef);
        if (!parentDocSnap.exists()) {
          throw new Error("Parent Document does not exist!");
        }

        const currentItem =
          parentDocSnap.data()[`${params.type}`][params.id || ""];
        const currentValue = currentItem?.value || 0;
        const diff = (params.value || 0) - (currentValue || 0);

        const currentItemTotal =
          parentDocSnap.data()[`${params.type}_value`] || 0;
        const newItemTotal = currentItemTotal + diff;

        const currentTotal = parentDocSnap.data().total_value || 0;
        const newTotal = currentTotal - diff;

        const currentItemDocRef = {
          ...(parentDocSnap.data()[`${params.type}`] || {}),
        };
        currentItemDocRef[params.id || ""] = {
          ...currentItem,
          name: params.name,
          value: params.value,
          date: params.date,
          updatedAt: dayjs().unix(),
        };

        transaction.update(parentDocRef, {
          [`${params.type}_value`]: newItemTotal,
          total_value: newTotal,
          [`${params.type}`]: currentItemDocRef,
        });
        return newItemTotal;
      });
    },
    options,
  });
};

export const deleteChargeDetailItem = ({
  params,
  options,
}: {
  params: ChargeDetailItemParamsType;
  options: FirebaseRequestOptions;
}) => {
  firebaseRequest({
    action: async () => {
      const parentDocRef = doc(dbCloud, "charge_lists", params.parentId || "");

      await runTransaction(dbCloud, async (transaction) => {
        // --- A. 讀取目前的父文件資料 (鎖定資料) ---
        const parentDocSnap = await transaction.get(parentDocRef);
        if (!parentDocSnap.exists()) {
          throw new Error("Parent Document does not exist!");
        }

        const currentItemTotal =
          parentDocSnap.data()[`${params.type}_value`] || 0;
        const newItemTotal = currentItemTotal - (params.value || 0);

        const currentTotal = parentDocSnap.data().total_value || 0;
        const newTotal = currentTotal + (params.value || 0);

        const currentItemDocRef = {
          ...(parentDocSnap.data()[`${params.type}`] || {}),
        };
        delete currentItemDocRef[params.id || ""];

        transaction.update(parentDocRef, {
          [`${params.type}_value`]: newItemTotal,
          total_value: newTotal,
          [`${params.type}`]: currentItemDocRef,
        });
        return newItemTotal;
      });
    },
    options,
  });
};


// export function handleAddMoney(allInventories, currentInventory, modalValues, setInventory, setShowAddMoneyModal) {
//   let { gold, silver, copper } = modalValues;
  
//   const wallet = { ...allInventories[currentInventory].wallet };
//   wallet.gold = Math.max(wallet.gold + gold, 0);
//   wallet.silver = Math.max(wallet.silver + silver, 0);
//   wallet.copper = Math.max(wallet.copper + copper, 0);
  
//   setInventory({ wallet });
//   setShowAddMoneyModal(false);
// }
export function handleAddMoney(allInventories, currentInventory, modalValues, subtractValues, setInventory, setShowAddMoneyModal, resetModalValues) {
  let { gold, silver, copper } = modalValues;
  
  gold = subtractValues.gold ? -gold : gold;
  silver = subtractValues.silver ? -silver : silver;
  copper = subtractValues.copper ? -copper : copper;
  
  const wallet = { ...allInventories[currentInventory].wallet };
  wallet.gold = Math.max(wallet.gold + gold, 0);
  wallet.silver = Math.max(wallet.silver + silver, 0);
  wallet.copper = Math.max(wallet.copper + copper, 0);
  
  setInventory({ wallet });
  resetModalValues();
  setShowAddMoneyModal(false);
}

export function handleCreateInventory(newInventoryName, allInventories, setAllInventories, setCurrentInventory) {
  if (!allInventories[newInventoryName]) {
    setAllInventories((prev) => ({
      ...prev,
      [newInventoryName]: {
        equipment: [],
        consumables: [],
        crafting: [],
        quest: [],
        misc: [],
        wallet: { gold: 0, silver: 0, copper: 0 },
      },
    }));
    setCurrentInventory(newInventoryName);
  }
}
export function handleDeleteInventory(inventoryName, allInventories, setAllInventories, setCurrentInventory) {
  if (inventoryName === "default") return;
  setAllInventories((prev) => {
    const updatedInventories = { ...prev };
    delete updatedInventories[inventoryName];
    return updatedInventories;
  });
  setCurrentInventory("default");
}
export function calculateTotalWeight(inventory) {
  return parseFloat(
    Object.entries(inventory).reduce((totalWeight, [key, items]) => {
      if (!Array.isArray(items)) {
        console.warn(`Expected array but got ${typeof items} for key ${key}`);
        return totalWeight;
      }
      return (
        totalWeight +
        items.reduce((sum, item) => sum + item.weight * item.quantity, 0)
      );
    }, 0).toFixed(1) // Limita a un decimal
  );
}

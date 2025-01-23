export function handleAddMoney(allInventories, currentInventory, modalValues, setInventory, setShowAddMoneyModal) {
  const { gold, silver, copper } = modalValues;
  let updatedGold =
    allInventories[currentInventory].wallet.gold + parseInt(gold);
  let updatedSilver =
    allInventories[currentInventory].wallet.silver + parseInt(silver);
  let updatedCopper =
    allInventories[currentInventory].wallet.copper + parseInt(copper);

  updatedSilver += Math.floor(updatedCopper / 100);
  updatedCopper %= 100;
  updatedGold += Math.floor(updatedSilver / 10);
  updatedSilver %= 10;

  setInventory({
    wallet: {
      gold: updatedGold,
      silver: updatedSilver,
      copper: updatedCopper,
    },
  });
  setShowAddMoneyModal(false); // Cierra el modal
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
  return Object.entries(inventory).reduce((totalWeight, [key, items]) => {
    if (!Array.isArray(items)) {
      console.warn(`Expected array but got ${typeof items} for key ${key}`);
      return totalWeight;
    }
    return (
      totalWeight +
      items.reduce((sum, item) => sum + item.weight * item.quantity, 0)
    );
  }, 0);
}

// export function handleAddMoney(allInventories, currentInventory, modalValues, setInventory, setShowAddMoneyModal) {
//   const { gold, silver, copper } = modalValues;

//   let updatedGold = allInventories[currentInventory].wallet.gold + parseInt(gold, 10);
//   let updatedSilver = allInventories[currentInventory].wallet.silver + parseInt(silver, 10);
//   let updatedCopper = allInventories[currentInventory].wallet.copper + parseInt(copper, 10);

//   // Ajustar las monedas según los valores (pueden ser negativos)
//   if (updatedCopper < 0) {
//     updatedSilver += Math.floor(updatedCopper / 100); // Reducir silver si falta copper
//     updatedCopper = (updatedCopper % 100 + 100) % 100; // Asegurar que el copper esté en rango [0, 99]
//   }

//   if (updatedSilver < 0) {
//     updatedGold += Math.floor(updatedSilver / 10); // Reducir gold si falta silver
//     updatedSilver = (updatedSilver % 10 + 10) % 10; // Asegurar que el silver esté en rango [0, 9]
//   }

//   if (updatedGold < 0) {
//     updatedGold = Math.max(updatedGold, 0); // Evita que el oro sea negativo si no se permite
//   }

//   // Actualizar el estado del inventario
//   setInventory({
//     wallet: {
//       gold: updatedGold,
//       silver: updatedSilver,
//       copper: updatedCopper,
//     },
//   });
//   setShowAddMoneyModal(false); // Cierra el modal
// }
export function handleAddMoney(allInventories, currentInventory, modalValues, setInventory, setShowAddMoneyModal) {
  const { gold, silver, copper } = modalValues;

  let updatedGold = allInventories[currentInventory].wallet.gold + parseInt(gold, 10);
  let updatedSilver = allInventories[currentInventory].wallet.silver + parseInt(silver, 10);
  let updatedCopper = allInventories[currentInventory].wallet.copper + parseInt(copper, 10);

  // No convertir automáticamente a oro, solo acumular
  setInventory({
    wallet: {
      gold: updatedGold,
      silver: updatedSilver,
      copper: updatedCopper,
    },
  });

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

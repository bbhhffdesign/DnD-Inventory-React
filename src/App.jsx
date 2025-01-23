import React, { useState, useEffect } from "react";
import CreateList from "./components/CreateList";
import SellItemForm from "./components/SellItemForm";
import CreateItem from "./components/CreateItem";
import {
  handleAddMoney,
  handleCreateInventory,
  handleDeleteInventory,
  calculateTotalWeight,
} from "./logic/header";

function InventoryApp() {
  const [allInventories, setAllInventories] = useState(() => {
    const saved = localStorage.getItem("allInventories");
    return saved
      ? JSON.parse(saved)
      : {
          default: {
            equipment: [],
            consumables: [],
            crafting: [],
            quest: [],
            misc: [],
            wallet: { gold: 0, silver: 0, copper: 0 },
            maxWeight: "", // Añadido para guardar capacidad de carga
          },
        };
  });

  const [currentInventory, setCurrentInventory] = useState("default");
  const [showForm, setShowForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [itemToSell, setItemToSell] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [modalValues, setModalValues] = useState({
    gold: 0,
    silver: 0,
    copper: 0,
  });
  const inventory = allInventories[currentInventory] || {
    equipment: [],
    consumables: [],
    crafting: [],
    quest: [],
    misc: [],
    wallet: { gold: 0, silver: 0, copper: 0 },
    maxWeight: "", // Default para evitar errores
  };

  const totalWeight = calculateTotalWeight(inventory);

  useEffect(() => {
    localStorage.setItem("allInventories", JSON.stringify(allInventories));
  }, [allInventories]);

  function setInventory(newInventory) {
    setAllInventories((prev) => ({
      ...prev,
      [currentInventory]: {
        ...prev[currentInventory],
        ...newInventory,
      },
    }));
  }

  function handleSellItem(item) {
    setItemToSell(item);
    setSellQuantity(1);
    setShowSellForm(true);
  }

  function handleSell() {
    const { category, index, value } = itemToSell;
    const item = allInventories[currentInventory][category][index];
    const sellValue = value * sellQuantity;

    // Update the wallet
    let { gold, silver, copper } = allInventories[currentInventory].wallet || {
      gold: 0,
      silver: 0,
      copper: 0,
    };
    copper += Math.round(sellValue * 1000);
    silver += Math.floor(copper / 100);
    copper %= 100;
    gold += Math.floor(silver / 10);
    silver %= 10;

    // Update the inventory
    setInventory({
      [category]: allInventories[currentInventory][category].map((it, i) =>
        i === index ? { ...it, quantity: it.quantity - sellQuantity } : it
      ),
      wallet: { gold, silver, copper },
    });

    setShowSellForm(false);
  }
  function handleDownload() {
    const dataStr = JSON.stringify(allInventories, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventarios.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const importedData = JSON.parse(ev.target.result);
            setAllInventories((prev) => ({ ...prev, ...importedData }));
          } catch (err) {
            alert(
              "Error al importar el archivo. Asegúrate de que sea un JSON válido."
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  return (
    <main className="frame">
      <header className="inventory__header">
        <div className="inventory__header-top">
          <select
            value={currentInventory}
            onChange={(e) => setCurrentInventory(e.target.value)}
          >
            {Object.keys(allInventories).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button className="header__dropdown-btn" onClick={console.log("AAAasAs")}>AA</button>
          <div className="header__dropdown-list">
            <button
              className="pure-button"
              onClick={() => {
                const newName = prompt("Nombre del nuevo inventario:");
                if (newName)
                  handleCreateInventory(
                    newName,
                    allInventories,
                    setAllInventories,
                    setCurrentInventory
                  );
              }}
            >
              Crear Inventario
            </button>
            {currentInventory !== "default" && (
              <button
                onClick={() =>
                  handleDeleteInventory(
                    currentInventory,
                    allInventories,
                    setAllInventories,
                    setCurrentInventory
                  )
                }
              >
                Eliminar Inventario
              </button>
            )}
            <button className="pure-button" onClick={handleDownload}>
              Exportar Inventarios
            </button>

            <button className="pure-button" onClick={handleUpload}>
              Importar Inventarios
            </button>
          </div>
        </div>
        <div className="inventory__header-bottom">
          <p
            style={{
              color: totalWeight > inventory.maxWeight ? "red" : "black",
            }}
          >
            <strong>Peso Total:</strong> {totalWeight} kg /{" "}
            <input
              type="number"
              value={inventory.maxWeight || ""}
              placeholder="Capacidad de Carga"
              onChange={(e) => {
                const maxWeight = Number(e.target.value) || "";
                setInventory({ maxWeight });
              }}
            />
          </p>
          <div className="inventory__header-wealth">
            <div className="inventory__header-wealth-container">
              <img
                src="https://img.icons8.com/?size=100&id=20043&format=png&color=000000"
                alt=""
              />
              <input
                type="number"
                name="gold"
                value={inventory.wallet?.gold || 0}
              />
            </div>
            <div className="inventory__header-wealth-container">
              <img
                src="https://img.icons8.com/?size=100&id=60371&format=png&color=000000"
                alt=""
              />
              <input
                type="number"
                name="silver"
                value={inventory.wallet?.silver || 0}
              />
            </div>
            <div className="inventory__header-wealth-container">
              <img
                src="https://img.icons8.com/?size=100&id=hvR5miLxMhJf&format=png&color=000000"
                alt=""
              />
              <input
                type="number"
                name="copper"
                value={inventory.wallet?.copper || 0}
              />
            </div>
            <button
              className="pure-button"
              onClick={() => setShowAddMoneyModal(true)} // Muestra el modal
            >
              Agregar Dinero
            </button>
          </div>
        </div>
      </header>
      {showAddMoneyModal && (
        <div className="modal">
          <form
            className="pure-form pure-form-stacked"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddMoney(
                allInventories,
                currentInventory,
                modalValues,
                setInventory,
                setShowAddMoneyModal
              );
            }}
          >
            <h2>Agregar Dinero</h2>
            <input
              type="number"
              placeholder="Oro"
              value={modalValues.gold}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value, 10) || 0);
                setModalValues({ ...modalValues, gold: value });
              }}
            />
            <div>
              <button className="pure-button" type="submit">
                Confirmar
              </button>
              <button
                className="pure-button"
                type="button"
                onClick={() => setShowAddMoneyModal(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {showForm && (
        <CreateItem
          setInventory={setInventory}
          inventory={inventory}
          onClose={() => setShowForm(false)}
        />
      )}
      {showSellForm && (
        <SellItemForm
          item={itemToSell}
          quantity={sellQuantity}
          setQuantity={setSellQuantity}
          onSell={handleSell}
          onClose={() => setShowSellForm(false)}
        />
      )}
      <CreateList
        updatedInventory={inventory}
        setInventory={setInventory}
        onSellItem={handleSellItem}
      />
      <button className="pure-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cerrar formulario" : "Agregar Item"}
      </button>
    </main>
  );
}

export default InventoryApp;

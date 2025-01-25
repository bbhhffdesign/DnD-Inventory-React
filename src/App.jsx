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

import Menu from "./components/Menu";

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
  const [dropdownCheck, setDropdownChecked] = useState(false);

  useEffect(() => {
    // Verifica si alguno de los modales está abierto
    const isModalOpen =
      showForm || showSellForm || showAddMoneyModal || dropdownCheck;

    const frameElement = document.querySelector(".frame");
    if (isModalOpen) {
      frameElement?.classList.add("overlay");
    } else {
      frameElement?.classList.remove("overlay");
    }
  }, [showForm, showSellForm, showAddMoneyModal, dropdownCheck]);

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
    <main className="frame"
    onClick={(e) => {
      // Cierra el modal si el clic no ocurre dentro del contenido
      if (e.target.classList.contains("overlay")) {
        setShowAddMoneyModal(false);
        setShowSellForm(false);
        setDropdownChecked(false);
        setShowForm(false);
      }
    }}>
      <header className="inventory__header">
        <div className="inventory__header-inner">
          <div className="inventory__header-top">
            <select className="select-name"
              value={currentInventory}
              onChange={(e) => setCurrentInventory(e.target.value)}
            >
              {Object.keys(allInventories).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="checkbox"
              className="header__dropdown-btn"
              onChange={(e) => setDropdownChecked(e.target.checked)}
            />
          </div>
          <div className="inventory__header-bottom">
            <div className="header__bottom-weight">
              <div className="weight__icon"></div>
              <p
                style={{
                  color: totalWeight > inventory.maxWeight ? "red" : "black",
                }}
              >
                {totalWeight} /{" "}
                <input
                  type="number"
                  value={inventory.maxWeight || ""}
                  placeholder="0"
                  onChange={(e) => {
                    const maxWeight = Number(e.target.value) || "";
                    setInventory({ maxWeight });
                  }}
                />
              </p>
            </div>
            <div className="inventory__header-wealth">
              <div className="inventory__header-wealth-container">
                <img
                  src="./src/assets/coin-gold.png"
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
                  src="./src/assets/coin-silver.png"
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
                  src="./src/assets/coin-copper.png"
                  alt=""
                />
                <input
                  type="number"
                  name="copper"
                  value={inventory.wallet?.copper || 0}
                />
              </div>
              <button
                className="pure-button addmoney"
                onClick={() => setShowAddMoneyModal((prev) => !prev)} // Muestra el modal
              >
                💲
              </button>
            </div>
          </div>
        </div>
      </header>
      {dropdownCheck && (
        <Menu
          dropdownCheck={dropdownCheck}
          setDropdownChecked={setDropdownChecked}
          handleCreateInventory={handleCreateInventory}
          handleDeleteInventory={handleDeleteInventory}
          currentInventory={currentInventory}
          allInventories={allInventories}
          setAllInventories={setAllInventories}
          setCurrentInventory={setCurrentInventory}
          handleDownload={handleDownload}
          handleUpload={handleUpload}
        />
      )}
      {showAddMoneyModal && (
        <div className="modal">
          <form
            className="pure-form pure-form-stacked addmoney-form"
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
                const value = parseInt(e.target.value, 10) || 0;
                setModalValues({ ...modalValues, gold: value });
              }}
            />
            <div className="modaladdmoney-buttons">
              <button className="pure-button" type="submit" style={{margin: "0"}}>
              <img src="./src/assets/tick.png" alt="" />
              </button>
              <button
                className="pure-button"
                type="button"
                onClick={() => setShowAddMoneyModal(false)}
              >
                <img src="./src/assets/x.png" alt="" />
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
      <button className="additem-button" onClick={() => setShowForm(!showForm)}>
        {/* {showForm ? "Cerrar formulario" : "Agregar Item"} */}
      </button>
    </main>
  );
}

export default InventoryApp;

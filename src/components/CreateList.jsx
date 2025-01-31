import { useState, useEffect } from "react";

export default function CreateList({
  updatedInventory,
  setInventory,
  onSellItem,
}) {
  const [lockedCategories, setLockedCategories] = useState({});
  const [visibleDescriptions, setVisibleDescriptions] = useState({});
  const [expandedCategories, setExpandedCategories] = useState(() => {
    // Leer el estado inicial de localStorage
    const savedState = localStorage.getItem("expandedCategories");
    return savedState ? JSON.parse(savedState) : {};
  });

  // Guardar el estado en localStorage cada vez que cambie expandedCategories
  useEffect(() => {
    localStorage.setItem(
      "expandedCategories",
      JSON.stringify(expandedCategories)
    );
  }, [expandedCategories]);

  function toggleCategoryDropdown(category) {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  function updateQuantity(category, index, delta) {
    setInventory({
      [category]: updatedInventory[category].map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ),
    });
  }

  function deleteItem(category, index) {
    setInventory({
      [category]: updatedInventory[category].filter((_, i) => i !== index),
    });
  }

  function toggleEquipmentItem(index, checked) {
    setInventory({
      equipment: updatedInventory.equipment
        .map((item, i) => (i === index ? { ...item, checked } : item))
        .sort((a, b) => (b.checked ? 1 : -1) - (a.checked ? 1 : -1)),
    });
  }

  function toggleLockCategory(category) {
    setLockedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  function toggleDescriptionVisibility(category, index) {
    const key = `${category}-${index}`;
    setVisibleDescriptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return Object.entries(updatedInventory)
    .filter(([category]) => category !== "wallet" && category !== "maxWeight")
    .map(([category, items]) => (
      <div key={category} className="category__container">
        <div
          className="category__bar"
          onClick={(e) => {
            if (e.target.tagName !== "INPUT") {
              toggleCategoryDropdown(category);
            }
          }}
        >
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <input
            className="lock__category"
            type="checkbox"
            name="lock-category"
            checked={lockedCategories[category] || false}
            onChange={(e) => {
              e.stopPropagation(); // Evita que el clic se propague al contenedor
              toggleLockCategory(category);
            }}
          />
        </div>
        <div
          className={`item__dropdown ${
            expandedCategories[category] ? "expanded" : ""
          }`}
        >
          {items.length > 0 ? (
            <table className="item__table">
              <thead className="item__headtable">
                <tr>
                  <th></th>
                  <th></th>
                  <th className="weight__icon-container">
                    <div className="weight__icon"></div>
                  </th>
                  <th>💲</th>
                  <th>Cant.</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              {items.map((item, index) => {
                const key = `${category}-${index}`;
                return (
                  <tbody key={index} className="item__bodytable">
                    <tr>
                      <td>
                        {category === "equipment" && (
                          <input
                            className="equipItem__checkbox"
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={(e) =>
                              toggleEquipmentItem(index, e.target.checked)
                            }
                            disabled={lockedCategories[category] || false}
                          />
                        )}
                      </td>
                      <td
                        style={{ minWidth: "100%" }}
                        onClick={() =>
                          toggleDescriptionVisibility(category, index)
                        }
                      >
                        {item.name}
                      </td>
                      <td>{item.weight}</td>
                      <td>{item.value}</td>
                      <td>
                        <button
                          className="removeButton"
                          onClick={() => updateQuantity(category, index, -1)}
                          disabled={lockedCategories[category] || false}
                        >
                          −
                        </button>
                        {item.quantity}
                        <button
                          className="addButton"
                          onClick={() => updateQuantity(category, index, 1)}
                          disabled={lockedCategories[category] || false}
                        >
                          +
                        </button>
                      </td>
                      {/* <td>
                          <button
                            className=""
                            onClick={() =>
                              onSellItem({ category, index, ...item })
                            }
                            disabled={lockedCategories[category] || false}
                          >
                            💲
                          </button>
                        </td>
                        <td>
                          <button
                            className=""
                            onClick={() => deleteItem(category, index)}
                            disabled={lockedCategories[category] || false}
                          >
                            🗑️
                          </button>
                        </td> */}
                    </tr>
                    {visibleDescriptions[key] && (
                      <tr>
                        <td
                          className="item__description"
                          colSpan="4"
                          style={{ padding: "1rem", textAlign: "left" }}
                        >
                          {item.description}
                        </td>
                        <td className="item__buttons">
                          <button
                            className=""
                            onClick={() =>
                              onSellItem({ category, index, ...item })
                            }
                            disabled={lockedCategories[category] || false}
                          >
                            💲
                          </button>
              
                          <button
                            className=""
                            onClick={() => deleteItem(category, index)}
                            disabled={lockedCategories[category] || false}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </table>
          ) : (
            <p style={{ textAlign: "center" }}>No hay items</p>
          )}
        </div>
      </div>
    ));
}

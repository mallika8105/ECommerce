import React from 'react';
import Modal from './Modal';
import { Check } from 'lucide-react';
import './SizeChartModal.css';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  onSelectSize?: (size: string) => void;
  selectedSize?: string | null;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose, categoryName, onSelectSize, selectedSize }) => {
  // Determine which size chart to show based on category
  const isMensClothing = categoryName?.toLowerCase().includes("men's") || categoryName?.toLowerCase().includes("men");
  const isWomensClothing = categoryName?.toLowerCase().includes("women's") || categoryName?.toLowerCase().includes("women");
  const isKidsClothing = categoryName?.toLowerCase().includes("kid's") || categoryName?.toLowerCase().includes("kids") || categoryName?.toLowerCase().includes("children");

  const handleSizeClick = (size: string) => {
    if (onSelectSize) {
      onSelectSize(size);
      // Don't close immediately - let user see the selection
      // They can close manually or click outside
    }
  };

  const renderSizeChart = () => {
    // Check women's and kids' first to avoid "men" matching "women"
    if (isWomensClothing) {
      return (
        <div className="size-chart-content">
          <h2 className="size-chart-title">Women's Clothing Size Chart</h2>
          <div className="size-chart-table-wrapper">
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust (inches)</th>
                  <th>Waist (inches)</th>
                  <th>Hip (inches)</th>
                  <th>Shoulder (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  onClick={() => handleSizeClick('XS')} 
                  className={`size-row ${selectedSize === 'XS' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      XS
                      {selectedSize === 'XS' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>30-32</td>
                  <td>24-26</td>
                  <td>34-36</td>
                  <td>14-14.5</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('S')} 
                  className={`size-row ${selectedSize === 'S' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      S
                      {selectedSize === 'S' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>32-34</td>
                  <td>26-28</td>
                  <td>36-38</td>
                  <td>14.5-15</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('M')} 
                  className={`size-row ${selectedSize === 'M' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      M
                      {selectedSize === 'M' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>34-36</td>
                  <td>28-30</td>
                  <td>38-40</td>
                  <td>15-15.5</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('L')} 
                  className={`size-row ${selectedSize === 'L' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      L
                      {selectedSize === 'L' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>36-38</td>
                  <td>30-32</td>
                  <td>40-42</td>
                  <td>15.5-16</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('XL')} 
                  className={`size-row ${selectedSize === 'XL' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      XL
                      {selectedSize === 'XL' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>38-40</td>
                  <td>32-34</td>
                  <td>42-44</td>
                  <td>16-16.5</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('XXL')} 
                  className={`size-row ${selectedSize === 'XXL' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      XXL
                      {selectedSize === 'XXL' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>40-42</td>
                  <td>34-36</td>
                  <td>44-46</td>
                  <td>16.5-17</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="size-chart-note">
            <p><strong>Note:</strong> All measurements are in inches. For best fit, measure yourself and compare with the chart above.</p>
            {onSelectSize && <p><strong>Tip:</strong> Click on any size row to select it.</p>}
          </div>
        </div>
      );
    } else if (isKidsClothing) {
      return (
        <div className="size-chart-content">
          <h2 className="size-chart-title">Kids' Clothing Size Chart</h2>
          <div className="size-chart-table-wrapper">
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Age</th>
                  <th>Height (inches)</th>
                  <th>Chest (inches)</th>
                  <th>Waist (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  onClick={() => handleSizeClick('2-3Y')} 
                  className={`size-row ${selectedSize === '2-3Y' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      2-3Y
                      {selectedSize === '2-3Y' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>2-3 Years</td>
                  <td>35-38</td>
                  <td>20-21</td>
                  <td>19-20</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('3-4Y')} 
                  className={`size-row ${selectedSize === '3-4Y' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      3-4Y
                      {selectedSize === '3-4Y' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>3-4 Years</td>
                  <td>38-41</td>
                  <td>21-22</td>
                  <td>20-21</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('4-5Y')} 
                  className={`size-row ${selectedSize === '4-5Y' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      4-5Y
                      {selectedSize === '4-5Y' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>4-5 Years</td>
                  <td>41-44</td>
                  <td>22-23</td>
                  <td>21-22</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('5-6Y')} 
                  className={`size-row ${selectedSize === '5-6Y' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      5-6Y
                      {selectedSize === '5-6Y' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>5-6 Years</td>
                  <td>44-47</td>
                  <td>23-24</td>
                  <td>22-23</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('7-8Y')} 
                  className={`size-row ${selectedSize === '7-8Y' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      7-8Y
                      {selectedSize === '7-8Y' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>7-8 Years</td>
                  <td>47-51</td>
                  <td>24-26</td>
                  <td>23-24</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('9-10Y')} 
                  className={`size-row ${selectedSize === '9-10Y' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      9-10Y
                      {selectedSize === '9-10Y' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>9-10 Years</td>
                  <td>51-55</td>
                  <td>26-28</td>
                  <td>24-26</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('11-12Y')} 
                  className={`size-row ${selectedSize === '11-12Y' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      11-12Y
                      {selectedSize === '11-12Y' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>11-12 Years</td>
                  <td>55-59</td>
                  <td>28-30</td>
                  <td>26-28</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="size-chart-note">
            <p><strong>Note:</strong> All measurements are in inches. Sizes are approximate and may vary by brand.</p>
            {onSelectSize && <p><strong>Tip:</strong> Click on any size row to select it.</p>}
          </div>
        </div>
      );
    } else if (isMensClothing) {
      return (
        <div className="size-chart-content">
          <h2 className="size-chart-title">Men's Clothing Size Chart</h2>
          <div className="size-chart-table-wrapper">
            <table className="size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Waist (inches)</th>
                  <th>Hip (inches)</th>
                  <th>Shoulder (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  onClick={() => handleSizeClick('XS')} 
                  className={`size-row ${selectedSize === 'XS' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      XS
                      {selectedSize === 'XS' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>34-36</td>
                  <td>28-30</td>
                  <td>34-36</td>
                  <td>16-16.5</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('S')} 
                  className={`size-row ${selectedSize === 'S' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      S
                      {selectedSize === 'S' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>36-38</td>
                  <td>30-32</td>
                  <td>36-38</td>
                  <td>16.5-17</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('M')} 
                  className={`size-row ${selectedSize === 'M' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      M
                      {selectedSize === 'M' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>38-40</td>
                  <td>32-34</td>
                  <td>38-40</td>
                  <td>17-17.5</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('L')} 
                  className={`size-row ${selectedSize === 'L' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      L
                      {selectedSize === 'L' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>40-42</td>
                  <td>34-36</td>
                  <td>40-42</td>
                  <td>17.5-18</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('XL')} 
                  className={`size-row ${selectedSize === 'XL' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      XL
                      {selectedSize === 'XL' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>42-44</td>
                  <td>36-38</td>
                  <td>42-44</td>
                  <td>18-18.5</td>
                </tr>
                <tr 
                  onClick={() => handleSizeClick('XXL')} 
                  className={`size-row ${selectedSize === 'XXL' ? 'selected-row' : ''}`}
                >
                  <td>
                    <div className="size-cell-content">
                      XXL
                      {selectedSize === 'XXL' && <Check size={16} className="size-check-icon" />}
                    </div>
                  </td>
                  <td>44-46</td>
                  <td>38-40</td>
                  <td>44-46</td>
                  <td>18.5-19</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="size-chart-note">
            <p><strong>Note:</strong> All measurements are in inches. For best fit, measure yourself and compare with the chart above.</p>
            {onSelectSize && <p><strong>Tip:</strong> Click on any size row to select it.</p>}
          </div>
        </div>
      );
    }

    return (
      <div className="size-chart-content">
        <h2 className="size-chart-title">Size Chart</h2>
        <p>Size chart information is not available for this category.</p>
      </div>
    );
  };

  const getTitle = () => {
    // Check in same order as renderSizeChart to ensure consistency
    if (isWomensClothing) return "Women's Clothing Size Chart";
    if (isKidsClothing) return "Kids' Clothing Size Chart";
    if (isMensClothing) return "Men's Clothing Size Chart";
    return "Size Chart";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {renderSizeChart()}
    </Modal>
  );
};

export default SizeChartModal;

extractPrice = ($) => {
  return $('.redirect-to.link-dark.tip.tip-not-mobile.tip-ajax').find('div').text();
}


extractBrandName = ($) => {
  return $('.col-xs-4.col-sm-2.product-prices-list-item-logo').text().split('>')[1].split('<')[0].trim().replace('\n','');
}

extractBrandRef = ($) => {
  return `https://www.electromenager-compare.com/index.php?action=link&id=${$('.col-xs-4.col-sm-2.product-prices-list-item-logo').find('div').attr('data-id')}`;
}


extractFromProductTech = ($, name) => {
  try {
    return $('.product-tech-row').map((i, div) => {
      div = $(div);
      if (div.find('.col-xs-12.col-md-3.product-tech-label').text().includes(name)){
         return div.find('.col-xs-12.col-md-9.product-tech-text').text().trim();
      }
    }).toArray();
  } catch (error) {
    return null;
  }
}

extractFromProductSpecs = ($, name) => {
  try {
    let value = null;
    $('.product-specs-list').find('li').each((i, li) => {
      li = $(li);
      if (li.text().includes(name)){
         value = li.find('b').text().trim();
      }
    });
    
    return value;

   } catch(error) {
     return null;
   }
}

extractFromProductTechObj = ($, name) => {
  try {

    let headerIndex = null;
    let values = {};
    $('.product-tech-row').map((i, div) => {
      div = $(div);
      if (!headerIndex){
        if (div.find('.col-xs-12.col-md-3.product-tech-label').text().includes(name)){
          headerIndex = i;
        }
      } else {
        let text = div.find('.col-xs-12.col-md-3.product-tech-label').text();
        if (text.includes('•')){
          values[text.trim().replace('•','').replace(':','')] = div.find('.col-xs-12.col-md-9.product-tech-text').text().trim();
        } else {
          headerIndex = null;
        }
      }
    });
    return values;

  } catch (error) {

    return null;
    
  }
}

extractReparability = ($) => {
  try {
    return $('.product-irepair-value').text().trim();
  } catch (error){
    return null;
  }
}

extractOrigin = ($) => {
  try {
    let value = null;

    $('col-xs-12 col-md-9 product-tech-text').each((i, div) => {
      div = $(div);
      if (div.text().includes('Origine de fabrication :')){
        value = div.text().trim();
      }
    });
    return value.split(':')[1];
  } catch (error){
    return null;
  }
}

const extractMachine = ($) => {
    return obj = {  
        brandRef: extractBrandRef($),
        brand: extractBrandName($),
        price: extractPrice($),
        energyClass: extractFromProductSpecs($, 'Classe énergie : '),
        loadingType: extractFromProductSpecs($, 'Chargement frontal ('),
        energyConsumption: extractFromProductTechObj($, 'Consommations électriques :'),
        waterConsumption: extractFromProductTechObj($, "Consommations d'eau :"),
        wringingEfficacity: extractFromProductTech($, 'Essorage :').join(' '),
        sparePartsAvailability: extractFromProductTech($, 'Dispo. des pièces détachées :')[0],
        reparabilityIndex: extractReparability($),
        fabricationOrigin: extractOrigin($),
        weight: extractFromProductTech($, 'Poids emballé :')[0]
     }
}

exports.extractMachine = extractMachine;


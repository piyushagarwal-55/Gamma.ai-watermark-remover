import fitz

def has_target_link(obj_rect, page, target_domain):
    for link in page.get_links():
        link_rect = fitz.Rect(link['from'])
        uri = link.get('uri', '').lower()
        if obj_rect.intersects(link_rect) and target_domain in uri:
            return True, link.get('uri', '')
    return False, ""

def remove_all_target_links(page, target_domain):
    removed_count = 0
    links = page.get_links()
    for link in reversed(links):
        uri = link.get('uri', '').lower()
        if target_domain in uri:
            page.delete_link(link)
            removed_count += 1
    return removed_count

def remove_corner_images_with_links(page, target_domain, corner_threshold=0.7):
    page_rect = page.rect
    right_threshold = page_rect.width * corner_threshold
    bottom_threshold = page_rect.height * corner_threshold
    
    removed_count = 0
    image_list = page.get_images(full=True)
    target_images = []
    images_to_remove = set()
    
    for img in image_list:
        xref = img[0]
        img_rects = page.get_image_rects(xref)
        for img_rect in img_rects:
            is_in_corner = (img_rect.x0 >= right_threshold and img_rect.y0 >= bottom_threshold)
            if is_in_corner:
                has_link, url = has_target_link(img_rect, page, target_domain)
                if has_link:
                    target_images.append((xref, img_rect, url))
                    images_to_remove.add(xref)
    
    if target_images:
        for img in image_list:
            xref = img[0]
            img_rects = page.get_image_rects(xref)
            for img_rect in img_rects:
                is_in_corner = (img_rect.x0 >= right_threshold and img_rect.y0 >= bottom_threshold)
                if is_in_corner:
                    images_to_remove.add(xref)
        
        for xref in images_to_remove:
            try:
                page.delete_image(xref)
                removed_count += 1
            except Exception:
                pass
    
    return removed_count

class WatermarkDetector:
    def __init__(self, target_domain="gamma.app"):
        self.target_domain = target_domain

    def identify_watermarks(self, pdf_path):
        results = []
        try:
            pdf_document = fitz.open(pdf_path)
            
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                page_rect = page.rect
                right_threshold = page_rect.width * 0.7
                bottom_threshold = page_rect.height * 0.7
                
                image_list = page.get_images(full=True)
                found_targets = False
                
                for img in image_list:
                    xref = img[0]
                    img_rects = page.get_image_rects(xref)
                    for img_rect in img_rects:
                        is_in_corner = (img_rect.x0 >= right_threshold and img_rect.y0 >= bottom_threshold)
                        if is_in_corner:
                            has_link, url = has_target_link(img_rect, page, self.target_domain)
                            if has_link:
                                results.append({
                                    'page': page_num,
                                    'type': 'corner_image_with_link',
                                    'xref': xref,
                                    'url': url
                                })
                                found_targets = True
                
                links = page.get_links()
                for link in links:
                    uri = link.get('uri', '').lower()
                    if self.target_domain in uri:
                        results.append({
                            'page': page_num,
                            'type': 'target_link',
                            'link': link,
                            'url': link.get('uri', '')
                        })
                        found_targets = True
            
            pdf_document.close()
            return results, None
            
        except Exception as e:
            return [], f"Error searching for elements: {str(e)}"

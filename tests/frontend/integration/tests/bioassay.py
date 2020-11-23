import helium as h

from . import shared


def bioassay(driver, root_url):
    shared.login(root_url)

    # /experiment/:id/
    h.go_to(root_url + "/ani/experiment/1/")
    h.wait_until(h.Text("Multiple generations").exists)
    assert len(driver.find_elements_by_css_selector("#objContainer table")) > 0
    in_table = False
    for elem in driver.find_elements_by_css_selector("#objContainer table td"):
        if "2 year bioassay" in elem.text:
            in_table = True
            break
    assert in_table is True
    assert h.Text(to_left_of="rat").value == "tester"

    # /animal-group/:id/
    h.go_to(root_url + "/ani/animal-group/1/")
    h.wait_until(h.Text("Dosing regime").exists)
    assert h.Text("sprague dawley").exists() == True
    assert h.Text("Oral diet").exists() == True
    assert h.Text("mg/kg/d").exists() == True
    assert h.Text("my outcome").exists() == True

    # /endpoint/:id/
    h.go_to(root_url + "/ani/endpoint/1/")
    h.wait_until(h.Text("my outcome").exists)
    assert "100 mg/kg/d" in h.Text(to_right_of="LOEL").value
    assert len(driver.find_elements_by_css_selector("svg")) > 0
    assert len(driver.find_elements_by_css_selector(".d3 .dr_dots .dose_points")) == 3
    assert len(driver.find_elements_by_css_selector("#dr-tbl")) > 0
    assert len(driver.find_elements_by_css_selector("#dr-tbl tr")) == 5

    shared.logout()
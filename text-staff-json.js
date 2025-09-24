try {
  //Defining main functions
  function processTags(t4Tag) {
    myContent = content || null;
    return String(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag));
  }



  let list = {};
  let sortName = String(processTags('<t4 type="content" name="Last Name" output="normal" modifiers="striptags,htmlentities" />')
    + ', ' + 
    processTags('<t4 type="content" name="First Name" output="normal" modifiers="striptags,htmlentities" />')
  );
  let lastName = processTags('<t4 type="content" name="Last Name" output="normal" modifiers="striptags,htmlentities" />');
  let firstName = processTags('<t4 type="content" name="First Name" output="normal" modifiers="striptags,htmlentities" />');


  
  list['userId'] = processTags('<t4 type="content" name="User ID" output="normal" modifiers="striptags,htmlentities" />');
  list['name'] = processTags('<t4 type="content" name="Name of Faculty or Staff Member" output="normal" modifiers="striptags,htmlentities" />');
  list['photo'] = processTags('<t4 type="content" name="Photo" output="normal" formatter="v10/image/pxl-crop" cdn="true" pxl-filter-id="66" />');
  list['typeOfStaff'] = processTags('<t4 type="content" name="Type of Staff" output="normal" display_field="value" delimiter="|" />');
  list['staffDepartment'] = processTags('<t4 type="content" name="Staff Department" output="normal" display_field="name"  delimiter="|" />');
  list['schoolCollege'] = processTags('<t4 type="content" name="Staff College" output="normal" display_field="name" delimiter="|" />');
  list['positionTitles'] = processTags('<t4 type="content" name="Position Title(s)" output="normal" modifiers="nl2br" />');
  list['departments'] = processTags('<t4 type="content" name="Departments" output="normal" modifiers="striptags,htmlentities" />');
  list['phone'] = processTags('<t4 type="content" name="Phone" output="normal" modifiers="striptags,htmlentities" />');
  list['email'] = processTags('<t4 type="content" name="Email Address" output="normal" modifiers="striptags,htmlentities" />');
  list['buildingRoomNumber'] = processTags('<t4 type="content" name="Building/Room Number" output="normal" modifiers="striptags,htmlentities" />');
  list['url'] = processTags('<t4 type="content" name="Name of Faculty or Staff Member" output="fulltext" use-element="true" filename-element="Name of Faculty or Staff Member" modifiers="striptags,htmlentities" />');
  list['nameSort'] = sortName;
  list['sortName'] = sortName;
  list['lastName'] = lastName;
  list['firstName'] = firstName;
  list['fullName'] = String(firstName + ' ' + lastName);
  list['areasOfExpertise'] = processTags('<t4 type="content" name="Areas of Expertise" output="normal" modifiers="striptags,htmlentities" />');
  list['primaryDepartment'] = processTags('<t4 type="content" name="Primary Department" output="normal" modifiers="nav_sections" />');
  list['secondaryDepartment'] = processTags('<t4 type="content" name="Secondary Department" output="normal" modifiers="nav_sections" />');
  

  
  let jsonObj = new org.json.JSONObject(list);
  document.write(jsonObj.toString() + ',');
} catch (err) {
  document.write(err);
}
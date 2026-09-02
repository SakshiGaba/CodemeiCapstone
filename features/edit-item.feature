Feature: Edit item
  As a user of the items app
  I want to edit the name of an existing item
  So that I can correct or update it without deleting and re-adding it

  Background:
    Given I am on the items page
    And an item named "Original Item" exists in the list

  Scenario: Editing an item's name
    When I click "Edit" for the item "Original Item"
    Then an input field with the current name "Original Item" is shown
    When I clear the input and enter "Updated Item"
    And I click "Save"
    Then the item list should contain "Updated Item"
    And the item list should not contain "Original Item"

  Scenario: Cancelling an edit leaves the item unchanged
    When I click "Edit" for the item "Original Item"
    And I clear the input and enter "Changed Name"
    And I click "Cancel"
    Then the item list should contain "Original Item"
    And the item list should not contain "Changed Name"

  Scenario: Saving an empty name does not update the item
    When I click "Edit" for the item "Original Item"
    And I clear the input
    And I click "Save"
    Then the item list should contain "Original Item"

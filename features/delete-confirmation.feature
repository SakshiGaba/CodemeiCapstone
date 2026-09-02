Feature: Delete confirmation dialog
  In order to prevent accidental deletions
  As a user managing items
  I want a confirmation dialog before an item is deleted

  Background:
    Given I am on the Items page

  Scenario: Clicking Delete prompts for confirmation instead of deleting immediately
    Given an item named "Delete Me" exists in the list
    When I click "Delete" for the item "Delete Me"
    Then a confirmation dialog is displayed
    And the dialog message includes the item name "Delete Me"
    And the item "Delete Me" is still present in the list

  Scenario: Cancelling the confirmation dialog keeps the item
    Given an item named "Keep Me" exists in the list
    When I click "Delete" for the item "Keep Me"
    And I click "Cancel" in the confirmation dialog
    Then the confirmation dialog is not displayed
    And the item "Keep Me" is still present in the list

  Scenario: Clicking outside the confirmation dialog cancels deletion
    Given an item named "Outside Click" exists in the list
    When I click "Delete" for the item "Outside Click"
    And I click outside the confirmation dialog
    Then the confirmation dialog is not displayed
    And the item "Outside Click" is still present in the list

  Scenario: Confirming the confirmation dialog deletes the item
    Given an item named "Confirm Delete" exists in the list
    When I click "Delete" for the item "Confirm Delete"
    And I click "Delete" in the confirmation dialog
    Then the confirmation dialog is not displayed
    And the item "Confirm Delete" is not present in the list
